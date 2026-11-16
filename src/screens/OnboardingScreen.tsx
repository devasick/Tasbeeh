import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme, space } from '../theme/theme';
import { useT } from '../i18n';
import { Button } from '../components/Button';
import { Chip, Segmented } from '../components/ui';
import { LANGUAGES } from '../i18n';
import { IconName } from '../components/ui';

const GOALS = [100, 300, 500, 1000];

export const OnboardingScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c, arabic } = useTheme();
  const { t, formatNumber } = useT();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(state.settings.dailyGoal);

  const pages: { icon: IconName; title: string; body: string }[] = [
    { icon: 'star-crescent', title: t('onb1Title'), body: t('onb1Body') },
    { icon: 'gesture-tap', title: t('onb2Title'), body: t('onb2Body') },
    { icon: 'mosque', title: t('onb3Title'), body: t('onb3Body') },
    { icon: 'flag-checkered', title: t('onb4Title'), body: t('onb4Body') },
  ];
  const page = pages[step];
  const last = step === pages.length - 1;

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: c.bg }]}>
      <View style={styles.top}>
        {step > 0 ? <Button title={t('back')} variant="ghost" size="small" onPress={() => setStep(step - 1)} /> : <View />}
        {!last && <Button title={t('skip')} variant="ghost" size="small" onPress={() => setStep(pages.length - 1)} />}
      </View>

      <View style={styles.body}>
        <View style={[styles.icon, { backgroundColor: c.primarySoft }]}>
          <MaterialCommunityIcons name={page.icon} size={56} color={c.primary} />
        </View>
        {step === 0 && <Text style={[arabic(30), { marginBottom: space.sm }]}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</Text>}
        <Text style={[styles.title, { color: c.text }]} accessibilityRole="header">
          {page.title}
        </Text>
        <Text style={[styles.text, { color: c.textMuted }]}>{page.body}</Text>

        {step === 0 && (
          <View style={{ width: '100%', marginTop: space.xl }}>
            <Segmented
              value={state.settings.language}
              onChange={(language) => dispatch({ type: 'updateSettings', settings: { language } })}
              options={LANGUAGES}
            />
          </View>
        )}
        {last && (
          <View style={styles.goals}>
            {GOALS.map((g) => (
              <Chip key={g} label={formatNumber(g)} selected={goal === g} onPress={() => setGoal(g)} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.dots}>
        {pages.map((_, i) => (
          <View key={i} style={[styles.dot, { backgroundColor: i === step ? c.primary : c.track, width: i === step ? 22 : 8 }]} />
        ))}
      </View>
      <Button
        title={last ? t('getStarted') : t('next')}
        size="large"
        onPress={() => (last ? dispatch({ type: 'finishOnboarding', dailyGoal: goal }) : setStep(step + 1))}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, padding: space.xl },
  top: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 48 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', marginBottom: space.xl },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: space.sm },
  text: { fontSize: 16, lineHeight: 24, textAlign: 'center' },
  goals: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: space.xl },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: space.lg },
  dot: { height: 8, borderRadius: 4, marginHorizontal: 4 },
});
