import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/theme';

interface CounterCardProps {
  name: string;
  count: number;
  goal: number | null;
  color: string;
  onPress: () => void;
  theme: Theme;
}

export const CounterCard: React.FC<CounterCardProps> = ({
  name,
  count,
  goal,
  color,
  onPress,
  theme,
}) => {
  const progress = goal ? Math.min((count / goal) * 100, 100) : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.colorDot, { backgroundColor: color }]} />
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
      
      <Text style={[styles.count, { color: theme.text }]}>
        {count.toLocaleString()}
      </Text>
      
      {goal && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: color },
              ]}
            />
          </View>
          <Text style={[styles.goalText, { color: theme.textSecondary }]}>
            Goal: {goal.toLocaleString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  count: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalText: {
    fontSize: 12,
  },
});
