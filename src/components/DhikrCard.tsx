import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Dhikr } from '../types';
import { useTheme } from '../theme/theme';
import { useApp } from '../context/AppContext';

interface DhikrCardProps {
  dhikr: Dhikr;
  onPress: (dhikr: Dhikr) => void;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({ dhikr, onPress }) => {
  const { settings } = useApp();
  const theme = useTheme(settings);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onPress(dhikr)}
      activeOpacity={0.7}
    >
      {/* Arabic Text */}
      <Text style={[styles.arabicText, { color: theme.text }]}>
        {dhikr.arabicText}
      </Text>

      {/* Transliteration */}
      <Text style={[styles.transliteration, { color: theme.primary }]}>
        {dhikr.transliteration}
      </Text>

      {/* Meaning */}
      <Text style={[styles.meaning, { color: theme.textSecondary }]}>
        {dhikr.meaning}
      </Text>

      {/* Recommended Count Badge */}
      <View style={[styles.badge, { backgroundColor: theme.primary }]}>
        <Text style={styles.badgeText}>
          {dhikr.recommendedCount}x
        </Text>
      </View>

      {/* Hadith Reference Section */}
      <View style={[styles.hadithSection, { borderTopColor: theme.border }]}>
        <Text style={[styles.hadithLabel, { color: theme.textSecondary }]}>
          📖 Hadith Reference:
        </Text>
        <Text style={[styles.hadithText, { color: theme.textSecondary }]} numberOfLines={2}>
          {dhikr.hadithReference}
        </Text>
        <Text style={[styles.hadithSource, { color: theme.primary }]}>
          {dhikr.hadithSource}
        </Text>
      </View>

      {/* Tap Indicator */}
      <View style={styles.tapIndicator}>
        <Text style={[styles.tapText, { color: theme.primary }]}>
          Tap to start counting →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arabicText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 48,
  },
  transliteration: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  meaning: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  badge: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hadithSection: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 12,
  },
  hadithLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  hadithText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  hadithSource: {
    fontSize: 11,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  tapIndicator: {
    marginTop: 12,
    alignItems: 'center',
  },
  tapText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
