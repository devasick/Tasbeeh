import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme/theme';
import { colors } from '../theme/colors';

interface ProgressBarProps {
  current: number;
  goal: number;
  color: string;
  theme: Theme;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  goal,
  color,
  theme,
}) => {
  const progress = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
              backgroundColor: colors.gold,
            },
          ]}
        />
      </View>
      <Text style={[styles.text, { color: colors.textMuted }]}>
        {current} / {goal}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
