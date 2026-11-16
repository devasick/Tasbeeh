import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { useTheme, space } from '../theme/theme';
import { useT } from '../i18n';
import { computeStats, dailySeries, monthlySeries } from '../state/model';
import { StatCard } from '../components/StatCard';
import { BarChart } from '../components/BarChart';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { Screen, Card, SectionTitle, Segmented, EmptyState, IconButton, Divider } from '../components/ui';

const PAGE = 20;

export const StatisticsScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c } = useTheme();
  const { t, formatNumber, formatWeekday, formatMonth, formatDateTime } = useT();
  const navigation = useNavigation<any>();
  const [range, setRange] = useState<'week' | 'month' | 'year'>('week');
  const [shown, setShown] = useState(PAGE);
  const now = Date.now();
  const stats = computeStats(state, now);
  const goal = state.settings.dailyGoal;

  const bars =
    range === 'year'
      ? monthlySeries(state, now).map((m, i, a) => ({ label: formatMonth(m.ts), value: m.total, highlight: i === a.length - 1 }))
      : dailySeries(state, now, range === 'week' ? 7 : 30).map((d, i, a) => ({
          label: range === 'week' ? formatWeekday(d.ts) : String(new Date(d.ts).getDate()),
          value: d.total,
          highlight: i === a.length - 1,
        }));
  const chartTotal = bars.reduce((a, b) => a + b.value, 0);

  const deleteSession = (id: string, name: string) =>
    Alert.alert(t('deleteEntryTitle'), t('deleteEntryBody', { name }), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => dispatch({ type: 'deleteSession', id }) },
    ]);

  const running = state.session && state.session.count > 0 ? state.session : null;
  const hasAny = stats.lifetime > 0 || state.sessions.length > 0;

  return (
    <Screen title={t('tabStats')} subtitle={t('statsSubtitle')}>
      <Card tint>
        <View style={styles.row}>
          <Text style={[styles.goalTitle, { color: c.text }]}>{stats.goalProgress >= 1 ? t('goalDone') : t('dailyGoal')}</Text>
          <Button title={t('edit')} variant="ghost" size="small" onPress={() => navigation.navigate('Settings')} style={{ minHeight: 36 }} />
        </View>
        <Text style={[styles.goalNumbers, { color: c.text }]}>
          {formatNumber(stats.today)} <Text style={{ color: c.textMuted, fontSize: 16 }}>/ {formatNumber(goal)}</Text>
        </Text>
        <ProgressBar value={stats.goalProgress} height={10} />
        <Text style={{ color: c.textMuted, marginTop: 8, fontSize: 13 }}>
          {stats.goalProgress >= 1 ? t('goalDoneBody') : t('goalRemaining', { n: formatNumber(Math.max(0, goal - stats.today)) })}
        </Text>
      </Card>

      <View style={styles.grid}>
        <StatCard title={t('today')} value={formatNumber(stats.today)} icon="white-balance-sunny" />
        <View style={{ width: space.md }} />
        <StatCard title={t('thisWeek')} value={formatNumber(stats.week)} icon="calendar-week" />
      </View>
      <View style={styles.grid}>
        <StatCard title={t('last30')} value={formatNumber(stats.month)} icon="calendar-month" />
        <View style={{ width: space.md }} />
        <StatCard title={t('lifetime')} value={formatNumber(stats.lifetime)} icon="infinity" />
      </View>

      <SectionTitle>{t('achievements')}</SectionTitle>
      <View style={styles.grid}>
        <StatCard title={t('streak')} value={stats.streak} subtitle={t('days')} icon="fire" />
        <View style={{ width: space.md }} />
        <StatCard title={t('goalDays')} value={stats.goalDays} subtitle={t('goalDaysSub')} icon="trophy-outline" />
      </View>
      <View style={styles.grid}>
        <StatCard title={t('targets')} value={stats.targetsCompleted} subtitle={t('targetsSub')} icon="check-decagram-outline" />
        <View style={{ width: space.md }} />
        <StatCard title={t('consistency')} value={`${stats.consistency}%`} subtitle={t('consistencySub')} icon="chart-timeline-variant" />
      </View>

      <SectionTitle>{t('progress')}</SectionTitle>
      <Card>
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { value: 'week', label: t('week') },
            { value: 'month', label: t('month') },
            { value: 'year', label: t('year') },
          ]}
        />
        <Text style={[styles.chartTotal, { color: c.text }]}>{t('totalInRange', { n: formatNumber(chartTotal) })}</Text>
        <BarChart
          bars={bars}
          goal={range === 'year' ? undefined : goal}
          goalLabel={t('dailyGoal')}
          summary={t('totalInRange', { n: formatNumber(chartTotal) })}
        />
      </Card>

      <SectionTitle>{t('mostRecited')}</SectionTitle>
      <Card>
        {stats.mostRecited.length === 0 ? (
          <Text style={{ color: c.textMuted }}>{t('noDataYet')}</Text>
        ) : (
          stats.mostRecited.map((m, i) => (
            <View key={m.id} style={{ marginBottom: i < stats.mostRecited.length - 1 ? space.md : 0 }}>
              <View style={styles.row}>
                <Text style={{ color: c.text, fontWeight: '600', flex: 1 }} numberOfLines={1}>
                  {i + 1}. {m.name}
                </Text>
                <Text style={{ color: c.textMuted, fontWeight: '600' }}>{formatNumber(m.total)}</Text>
              </View>
              <ProgressBar value={m.total / stats.mostRecited[0].total} height={6} color={i === 0 ? c.accent : c.primary} />
            </View>
          ))
        )}
      </Card>

      <SectionTitle>{t('history')}</SectionTitle>
      {!hasAny && !running ? (
        <EmptyState
          icon="history"
          title={t('noHistoryTitle')}
          text={t('noHistoryBody')}
          action={<Button title={t('startCounting')} onPress={() => navigation.navigate('Home')} />}
        />
      ) : (
        <Card style={{ paddingVertical: space.sm }}>
          {running && (
            <View style={styles.entry}>
              <MaterialCommunityIcons name="progress-clock" size={22} color={c.primary} />
              <View style={styles.entryBody}>
                <Text style={{ color: c.text, fontWeight: '600' }}>{t('inProgress')}</Text>
                <Text style={{ color: c.textMuted, fontSize: 12 }}>{formatDateTime(running.startedAt)}</Text>
              </View>
              <Text style={{ color: c.text, fontWeight: '700' }}>{formatNumber(running.count)}</Text>
            </View>
          )}
          {state.sessions.slice(0, shown).map((s, i) => (
            <View key={s.id}>
              {(i > 0 || running) && <Divider />}
              <View style={styles.entry}>
                <MaterialCommunityIcons
                  name={s.completed ? 'check-circle' : 'circle-outline'}
                  size={22}
                  color={s.completed ? c.accent : c.textMuted}
                />
                <View style={styles.entryBody}>
                  <Text style={{ color: c.text, fontWeight: '600' }} numberOfLines={1}>
                    {s.name}
                  </Text>
                  <Text style={{ color: c.textMuted, fontSize: 12 }}>{formatDateTime(s.endedAt)}</Text>
                </View>
                <Text style={{ color: c.text, fontWeight: '700' }}>
                  {formatNumber(s.count)}
                  {s.target ? <Text style={{ color: c.textMuted, fontWeight: '400' }}> / {s.target}</Text> : null}
                </Text>
                <IconButton icon="trash-can-outline" label={t('deleteEntryTitle')} onPress={() => deleteSession(s.id, s.name)} size={20} />
              </View>
            </View>
          ))}
          {state.sessions.length > shown && (
            <Button title={t('showMore')} variant="ghost" size="small" onPress={() => setShown(shown + PAGE)} />
          )}
        </Card>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  goalTitle: { fontSize: 16, fontWeight: '700' },
  goalNumbers: { fontSize: 34, fontWeight: '700', marginBottom: 8 },
  grid: { flexDirection: 'row', marginBottom: space.md },
  chartTotal: { fontSize: 15, fontWeight: '600', marginTop: space.md, marginBottom: space.sm },
  entry: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  entryBody: { flex: 1, marginLeft: 12, marginRight: 8 },
});
