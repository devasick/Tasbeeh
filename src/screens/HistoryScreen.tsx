import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { useTheme } from '../theme/theme';
import { StatCard } from '../components/StatCard';
import { formatDate, formatNumber } from '../utils/helpers';
import { CountHistory } from '../types';

export const HistoryScreen: React.FC = () => {
  const { history, statistics, settings } = useApp();
  const theme = useTheme(settings);

  const renderHistoryItem = ({ item }: { item: CountHistory }) => {
    const isGoalReached = item.goal !== null && item.count >= item.goal;

    return (
      <View style={[styles.historyItem, { backgroundColor: theme.card }]}>
        <View style={styles.historyHeader}>
          <Text style={[styles.historyName, { color: theme.text }]}>
            {item.counterName}
          </Text>
          {isGoalReached && <Text style={styles.goalBadge}>🎯 Goal</Text>}
        </View>
        <View style={styles.historyDetails}>
          <Text style={[styles.historyCount, { color: theme.primary }]}>
            {formatNumber(item.count)} counts
          </Text>
          {item.goal && (
            <Text style={[styles.historyGoal, { color: theme.textSecondary }]}>
              Goal: {formatNumber(item.goal)}
            </Text>
          )}
        </View>
        <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
          {formatDate(item.completedAt)}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Statistics Overview */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Overview
      </Text>
      
      <View style={styles.statsRow}>
        <StatCard
          title="Total"
          value={formatNumber(statistics.totalCounts)}
          subtitle="All time"
          theme={theme}
        />
        <StatCard
          title="Today"
          value={formatNumber(statistics.todayCounts)}
          subtitle="counts"
          theme={theme}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="This Week"
          value={formatNumber(statistics.weekCounts)}
          subtitle="counts"
          theme={theme}
        />
        <StatCard
          title="This Month"
          value={formatNumber(statistics.monthCounts)}
          subtitle="counts"
          theme={theme}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Goals"
          value={statistics.goalsCompleted}
          subtitle="completed"
          theme={theme}
        />
        <StatCard
          title="Streak"
          value={statistics.currentStreak}
          subtitle="days"
          theme={theme}
        />
      </View>

      {statistics.mostUsedCounter && (
        <View style={[styles.highlightCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.highlightLabel, { color: theme.textSecondary }]}>
            Most Used Counter
          </Text>
          <Text style={[styles.highlightValue, { color: theme.primary }]}>
            {statistics.mostUsedCounter}
          </Text>
        </View>
      )}

      {/* History List */}
      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 30 }]}>
        Recent History
      </Text>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No history yet
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Complete a goal to see it here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderHistoryItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.historyList}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: -6,
  },
  highlightCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  highlightValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyList: {
    paddingBottom: 20,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
    fontWeight: '600',
  },
  goalBadge: {
    fontSize: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  historyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  historyCount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyGoal: {
    fontSize: 14,
  },
  historyDate: {
    fontSize: 13,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
  },
});
