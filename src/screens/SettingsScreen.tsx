import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, Linking } from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme, space } from '../theme/theme';
import { useT, LANGUAGES } from '../i18n';
import { Reminder } from '../types';
import { requestNotificationPermission } from '../utils/notifications';
import { Screen, Card, SectionTitle, Segmented, SettingRow, Divider, Chip, Stepper, Sheet, IconButton, styles as ui } from '../components/ui';
import { Button } from '../components/Button';

const GOALS = [100, 300, 500, 1000];

export const SettingsScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c, arabic } = useTheme();
  const { t, formatNumber, formatClock, weekdayShort } = useT();
  const { settings } = state;
  const set = (s: Partial<typeof settings>) => dispatch({ type: 'updateSettings', settings: s });
  const [draft, setDraft] = useState<Reminder | null>(null);

  const ensureNotifications = async () => {
    if (await requestNotificationPermission()) return true;
    Alert.alert(t('notifDeniedTitle'), t('notifDeniedBody'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('openSettings'), onPress: () => Linking.openSettings() },
    ]);
    return false;
  };

  const newReminder = (): Reminder => ({
    id: `r-${Date.now()}`,
    hour: 7,
    minute: 0,
    days: [0, 1, 2, 3, 4, 5, 6],
    message: t('defaultReminder'),
    enabled: true,
  });

  const saveReminder = async () => {
    if (!draft) return;
    if (draft.days.length === 0) return Alert.alert(t('pickDaysTitle'), t('pickDaysBody'));
    if (draft.enabled && !(await ensureNotifications())) return;
    dispatch({ type: 'saveReminder', reminder: { ...draft, message: draft.message.trim() || t('defaultReminder') } });
    setDraft(null);
  };

  const toggleReminder = async (r: Reminder, on: boolean) => {
    if (on && !(await ensureNotifications())) return;
    dispatch({ type: 'saveReminder', reminder: { ...r, enabled: on } });
  };

  const deleteReminder = () => {
    if (!draft) return;
    Alert.alert(t('deleteReminderTitle'), t('deleteReminderBody'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: () => {
          dispatch({ type: 'deleteReminder', id: draft.id });
          setDraft(null);
        },
      },
    ]);
  };

  const dayLabel = (days: number[]) =>
    days.length === 7 ? t('everyDay') : [...days].sort().map((d) => weekdayShort(d)).join(', ');

  return (
    <Screen title={t('tabSettings')}>
      <SectionTitle>{t('appearance')}</SectionTitle>
      <Card>
        <Text style={[ui.label, { color: c.textMuted }]}>{t('theme')}</Text>
        <Segmented
          value={settings.theme}
          onChange={(theme) => set({ theme })}
          options={[
            { value: 'system', label: t('themeSystem') },
            { value: 'light', label: t('themeLight') },
            { value: 'dark', label: t('themeDark') },
          ]}
        />
        <Text style={[ui.label, { color: c.textMuted, marginTop: space.lg }]}>{t('counterStyle')}</Text>
        <Segmented
          value={settings.counterStyle}
          onChange={(counterStyle) => set({ counterStyle })}
          options={[
            { value: 'ring', label: t('styleRing') },
            { value: 'digital', label: t('styleDigital') },
          ]}
        />
        <Text style={[ui.label, { color: c.textMuted, marginTop: space.lg }]}>{t('language')}</Text>
        <Segmented value={settings.language} onChange={(language) => set({ language })} options={LANGUAGES} />
        <View style={[styles.row, { marginTop: space.lg }]}>
          <Text style={[ui.label, { color: c.textMuted, flex: 1, marginBottom: 0 }]}>{t('arabicSize')}</Text>
          <Stepper
            value={`${Math.round(settings.arabicScale * 100)}%`}
            minusLabel={t('smaller')}
            plusLabel={t('larger')}
            onMinus={() => set({ arabicScale: Math.max(0.8, +(settings.arabicScale - 0.1).toFixed(1)) })}
            onPlus={() => set({ arabicScale: Math.min(1.6, +(settings.arabicScale + 0.1).toFixed(1)) })}
          />
        </View>
        <Text style={[arabic(26), { marginTop: space.sm }]}>سُبْحَانَ اللهِ وَبِحَمْدِهِ</Text>
      </Card>

      <SectionTitle>{t('counting')}</SectionTitle>
      <Card style={{ paddingVertical: space.sm }}>
        <SettingRow icon="vibrate" label={t('vibration')} description={t('vibrationDesc')} value={settings.vibration} onValueChange={(vibration) => set({ vibration })} />
        <Divider />
        <SettingRow icon="volume-high" label={t('sound')} description={t('soundDesc')} value={settings.sound} onValueChange={(sound) => set({ sound })} />
        {settings.sound && (
          <View style={{ paddingBottom: space.sm }}>
            <Segmented
              value={settings.volume}
              onChange={(volume) => set({ volume })}
              options={[
                { value: 0.3, label: t('volLow') },
                { value: 0.6, label: t('volMedium') },
                { value: 1, label: t('volHigh') },
              ]}
            />
          </View>
        )}
        <Divider />
        <SettingRow icon="cellphone-lock" label={t('keepAwake')} description={t('keepAwakeDesc')} value={settings.keepAwake} onValueChange={(keepAwake) => set({ keepAwake })} />
        <Divider />
        <SettingRow icon="autorenew" label={t('autoReset')} description={t('autoResetDesc')} value={settings.autoReset} onValueChange={(autoReset) => set({ autoReset })} />
      </Card>

      <SectionTitle>{t('dailyGoal')}</SectionTitle>
      <Card>
        <View style={styles.wrap}>
          {GOALS.map((g) => (
            <Chip key={g} label={formatNumber(g)} selected={settings.dailyGoal === g} onPress={() => set({ dailyGoal: g })} />
          ))}
        </View>
        <View style={styles.row}>
          <Text style={{ color: c.textMuted, flex: 1 }}>{t('dailyGoalDesc')}</Text>
          <Stepper
            value={formatNumber(settings.dailyGoal)}
            minusLabel={t('smaller')}
            plusLabel={t('larger')}
            onMinus={() => set({ dailyGoal: Math.max(10, settings.dailyGoal - 50) })}
            onPlus={() => set({ dailyGoal: Math.min(100000, settings.dailyGoal + 50) })}
          />
        </View>
      </Card>

      <SectionTitle right={<IconButton icon="plus-circle" label={t('addReminder')} onPress={() => setDraft(newReminder())} color={c.primary} />}>
        {t('reminders')}
      </SectionTitle>
      <Card style={{ paddingVertical: space.sm }}>
        {state.reminders.length === 0 ? (
          <View style={{ paddingVertical: space.md }}>
            <Text style={{ color: c.textMuted, marginBottom: space.md, lineHeight: 20 }}>{t('noReminders')}</Text>
            <Button title={t('addReminder')} icon="bell-plus-outline" variant="outline" onPress={() => setDraft(newReminder())} />
          </View>
        ) : (
          state.reminders.map((r, i) => (
            <View key={r.id}>
              {i > 0 && <Divider />}
              <SettingRow
                icon="bell-outline"
                label={`${formatClock(r.hour, r.minute)} · ${dayLabel(r.days)}`}
                description={r.message}
                value={r.enabled}
                onValueChange={(on) => toggleReminder(r, on)}
              />
              <Button title={t('edit')} variant="ghost" size="small" onPress={() => setDraft(r)} style={{ alignSelf: 'flex-start', minHeight: 36 }} />
            </View>
          ))
        )}
      </Card>

      <SectionTitle>{t('about')}</SectionTitle>
      <Card style={{ paddingVertical: space.sm }}>
        <SettingRow icon="information-outline" label="Tasbeeh Counter Pro" description={t('aboutDesc')} />
        <Divider />
        <SettingRow icon="school-outline" label={t('showIntro')} onPress={() => dispatch({ type: 'restartOnboarding' })} />
      </Card>

      <Sheet visible={!!draft} onClose={() => setDraft(null)} title={t('reminder')}>
        {draft && (
          <>
            <Text style={[ui.label, { color: c.textMuted }]}>{t('time')}</Text>
            <View style={[styles.row, { justifyContent: 'center', marginBottom: space.md }]}>
              <Stepper
                value={String(draft.hour).padStart(2, '0')}
                minusLabel={t('earlier')}
                plusLabel={t('later')}
                onMinus={() => setDraft({ ...draft, hour: (draft.hour + 23) % 24 })}
                onPlus={() => setDraft({ ...draft, hour: (draft.hour + 1) % 24 })}
              />
              <Text style={{ color: c.text, fontSize: 22, fontWeight: '700' }}>:</Text>
              <Stepper
                value={String(draft.minute).padStart(2, '0')}
                minusLabel={t('earlier')}
                plusLabel={t('later')}
                onMinus={() => setDraft({ ...draft, minute: (draft.minute + 55) % 60 })}
                onPlus={() => setDraft({ ...draft, minute: (draft.minute + 5) % 60 })}
              />
            </View>
            <Text style={[ui.label, { color: c.textMuted }]}>{t('days')}</Text>
            <View style={styles.wrap}>
              {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                <Chip
                  key={d}
                  label={weekdayShort(d)}
                  selected={draft.days.includes(d)}
                  onPress={() =>
                    setDraft({ ...draft, days: draft.days.includes(d) ? draft.days.filter((x) => x !== d) : [...draft.days, d] })
                  }
                />
              ))}
            </View>
            <Text style={[ui.label, { color: c.textMuted }]}>{t('message')}</Text>
            <TextInput
              value={draft.message}
              onChangeText={(message) => setDraft({ ...draft, message })}
              maxLength={120}
              accessibilityLabel={t('message')}
              placeholderTextColor={c.textMuted}
              style={[ui.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
            />
            <Button title={t('save')} onPress={saveReminder} />
            {state.reminders.some((r) => r.id === draft.id) && (
              <Button title={t('delete')} variant="ghost" icon="trash-can-outline" onPress={deleteReminder} style={{ marginTop: space.sm }} />
            )}
          </>
        )}
      </Sheet>
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: space.sm },
});
