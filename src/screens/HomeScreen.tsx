import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, TextInput, useWindowDimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme, space, radius } from '../theme/theme';
import { useT } from '../i18n';
import { computeStats, findDhikr, getProgress } from '../state/model';
import { PRESET_TARGETS } from '../types';
import { CounterDisplay } from '../components/CounterDisplay';
import { Celebration } from '../components/Celebration';
import { ProgressBar } from '../components/ProgressBar';
import { Chip, IconButton, Sheet, styles as ui } from '../components/ui';
import { Button } from '../components/Button';
import { tapFeedback, completeFeedback } from '../utils/feedback';

const KEEP_AWAKE_TAG = 'tasbeeh-counting';

export const HomeScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c, arabic } = useTheme();
  const { t, formatNumber, formatDay } = useT();
  const navigation = useNavigation<any>();
  const { height } = useWindowDimensions();
  const { settings } = state;
  const dhikr = findDhikr(state, state.activeId)!;
  const { count, target } = getProgress(state, state.activeId);
  const stats = computeStats(state, Date.now());
  const [customOpen, setCustomOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!settings.keepAwake) return;
      activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
      return () => {
        deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
      };
    }, [settings.keepAwake])
  );

  // Completion feedback and optional auto-reset, keyed off the reducer's celebrateAt.
  const seen = useRef(state.celebrateAt);
  useEffect(() => {
    if (state.celebrateAt === seen.current) return;
    seen.current = state.celebrateAt;
    completeFeedback(settings.vibration, settings.sound, settings.volume);
    if (!settings.autoReset) return;
    const timer = setTimeout(() => dispatch({ type: 'reset', now: Date.now() }), 1800);
    return () => clearTimeout(timer);
  }, [state.celebrateAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const increment = () => {
    dispatch({ type: 'increment', now: Date.now() });
    tapFeedback(settings.vibration, settings.sound, settings.volume);
  };

  const confirmReset = () =>
    Alert.alert(t('resetTitle'), t('resetBody', { name: dhikr.transliteration, count }), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('reset'), style: 'destructive', onPress: () => dispatch({ type: 'reset', now: Date.now() }) },
    ]);

  const setTarget = (value: number | null) => dispatch({ type: 'setTarget', id: dhikr.id, target: value });

  const saveCustom = () => {
    const n = parseInt(customValue, 10);
    if (!Number.isFinite(n) || n < 1 || n > 100000) {
      Alert.alert(t('invalidTargetTitle'), t('invalidTargetBody'));
      return;
    }
    setTarget(n);
    setCustomOpen(false);
  };

  const isCustomTarget = target !== null && !PRESET_TARGETS.includes(target);
  const motivation = t(`motivation${(new Date().getDate() % 6) + 1}` as any);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={[ui.content, { flexGrow: 1 }]} bounces={false}>
        <View style={[styles.header, { paddingTop: space.lg }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: c.text }]}>{t('greeting')}</Text>
            <Text style={{ color: c.textMuted, fontSize: 13 }}>{formatDay(Date.now())}</Text>
          </View>
          <IconButton icon="format-list-bulleted" label={t('chooseDhikr')} onPress={() => navigation.navigate('Dhikr')} color={c.primary} />
        </View>

        <Pressable
          onPress={() => navigation.navigate('Statistics')}
          accessibilityRole="button"
          accessibilityLabel={t('dailyGoalA11y', { today: stats.today, goal: settings.dailyGoal })}
          style={[styles.goalCard, { backgroundColor: c.primarySoft }]}
        >
          <View style={styles.goalRow}>
            <Text style={[styles.goalLabel, { color: c.text }]}>
              {stats.goalProgress >= 1 ? t('goalDone') : t('dailyGoal')}
            </Text>
            <Text style={{ color: c.text, fontWeight: '700' }}>
              {formatNumber(stats.today)} / {formatNumber(settings.dailyGoal)}
            </Text>
          </View>
          <ProgressBar value={stats.goalProgress} />
          <View style={[styles.goalRow, { marginTop: 8, marginBottom: 0 }]}>
            <Text style={{ color: c.textMuted, fontSize: 13, flex: 1 }} numberOfLines={2}>
              {motivation}
            </Text>
            {stats.streak > 0 && (
              <View style={styles.streak}>
                <MaterialCommunityIcons name="fire" size={16} color={c.accent} />
                <Text style={{ color: c.accent, fontWeight: '700', marginLeft: 2 }}>{stats.streak}</Text>
              </View>
            )}
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Dhikr')}
          accessibilityRole="button"
          accessibilityHint={t('chooseDhikr')}
          style={styles.dhikrBlock}
        >
          {dhikr.arabicText ? (
            <Text style={arabic(28)} numberOfLines={2} adjustsFontSizeToFit>
              {dhikr.arabicText}
            </Text>
          ) : null}
          <Text style={[styles.translit, { color: c.primary }]} numberOfLines={1}>
            {dhikr.transliteration}
          </Text>
          {dhikr.meaning ? (
            <Text style={[styles.meaning, { color: c.textMuted }]} numberOfLines={2}>
              {dhikr.meaning}
            </Text>
          ) : null}
        </Pressable>

        <View style={styles.counterArea}>
          <CounterDisplay
            count={count}
            target={target}
            style={settings.counterStyle}
            onPress={increment}
            label={dhikr.transliteration}
            hint={t('tapToCount')}
            maxHeight={Math.max(200, height - 480)}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={styles.targets}>
          {PRESET_TARGETS.map((n) => (
            <Chip key={n} label={formatNumber(n)} selected={target === n} onPress={() => setTarget(n)} />
          ))}
          <Chip
            label={isCustomTarget ? formatNumber(target!) : t('custom')}
            icon="pencil"
            selected={isCustomTarget}
            onPress={() => {
              setCustomValue(target ? String(target) : '');
              setCustomOpen(true);
            }}
          />
          <Chip label="∞" selected={target === null} onPress={() => setTarget(null)} />
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title={t('undo')}
            icon="undo-variant"
            variant="secondary"
            onPress={() => dispatch({ type: 'undo', now: Date.now() })}
            disabled={count === 0}
            style={{ flex: 1, marginRight: space.sm }}
          />
          <Button
            title={t('reset')}
            icon="restart"
            variant="outline"
            onPress={confirmReset}
            disabled={count === 0}
            style={{ flex: 1, marginLeft: space.sm }}
          />
        </View>
      </ScrollView>

      <Celebration
        trigger={state.celebrateAt}
        title={t('targetReached')}
        subtitle={t('targetReachedBody', { count: target ?? count, name: dhikr.transliteration })}
      />

      <Sheet visible={customOpen} onClose={() => setCustomOpen(false)} title={t('customTarget')}>
        <TextInput
          value={customValue}
          onChangeText={(v) => setCustomValue(v.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          placeholder="e.g. 500"
          placeholderTextColor={c.textMuted}
          autoFocus
          maxLength={6}
          accessibilityLabel={t('customTarget')}
          style={[ui.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
          onSubmitEditing={saveCustom}
        />
        <Button title={t('save')} onPress={saveCustom} />
      </Sheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: space.md },
  greeting: { fontSize: 22, fontWeight: '700' },
  goalCard: { borderRadius: radius.lg, padding: space.lg },
  goalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalLabel: { fontSize: 15, fontWeight: '600' },
  streak: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  dhikrBlock: { alignItems: 'center', marginTop: space.lg, minHeight: 64 },
  translit: { fontSize: 18, fontWeight: '700', marginTop: 2, textAlign: 'center' },
  meaning: { fontSize: 14, textAlign: 'center', marginTop: 2 },
  counterArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: space.lg, minHeight: 240 },
  targets: { paddingVertical: 4 },
  actions: { flexDirection: 'row', marginTop: space.sm },
});
