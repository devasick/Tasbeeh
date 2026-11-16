import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dhikr, Progress } from '../types';
import { useTheme, radius, space } from '../theme/theme';
import { useT } from '../i18n';
import { ProgressBar } from './ProgressBar';
import { IconButton } from './ui';

interface DhikrCardProps {
  dhikr: Dhikr;
  progress: Progress;
  active: boolean;
  onPress: () => void;
  onEdit?: () => void;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({ dhikr, progress, active, onPress, onEdit }) => {
  const { c, arabic } = useTheme();
  const { t, formatNumber } = useT();
  const [open, setOpen] = useState(false);
  const pct = progress.target ? Math.min(1, progress.count / progress.target) : 0;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${dhikr.transliteration}. ${dhikr.meaning}. ${formatNumber(progress.count)}${progress.target ? ` / ${progress.target}` : ''}`}
      accessibilityHint={t('startCounting')}
      android_ripple={{ color: c.primarySoft }}
      style={[styles.card, { backgroundColor: c.surface, borderColor: active ? c.primary : c.border }]}
    >
      <View style={styles.top}>
        <View style={[styles.badge, { backgroundColor: c.accentSoft }]}>
          <Text style={[styles.badgeText, { color: c.accent }]}>{dhikr.recommendedCount}×</Text>
        </View>
        {active && (
          <View style={[styles.badge, { backgroundColor: c.primarySoft, marginLeft: 6 }]}>
            <Text style={[styles.badgeText, { color: c.primary }]}>{t('counting')}</Text>
          </View>
        )}
        <View style={{ flex: 1 }} />
        {onEdit && <IconButton icon="pencil-outline" label={t('editDhikr')} onPress={onEdit} />}
      </View>

      {dhikr.arabicText ? <Text style={[arabic(26), { marginVertical: 4 }]}>{dhikr.arabicText}</Text> : null}
      <Text style={[styles.translit, { color: c.primary }]}>{dhikr.transliteration}</Text>
      {dhikr.meaning ? <Text style={[styles.meaning, { color: c.textMuted }]}>{dhikr.meaning}</Text> : null}

      <View style={styles.progressRow}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <ProgressBar value={pct} height={6} color={pct >= 1 ? c.accent : c.primary} />
        </View>
        <Text style={{ color: c.textMuted, fontSize: 13, fontWeight: '600' }}>
          {formatNumber(progress.count)}
          {progress.target ? ` / ${formatNumber(progress.target)}` : ''}
        </Text>
      </View>

      {dhikr.hadithReference ? (
        <>
          <Pressable
            onPress={() => setOpen(!open)}
            accessibilityRole="button"
            accessibilityState={{ expanded: open }}
            hitSlop={8}
            style={styles.refToggle}
          >
            <MaterialCommunityIcons name="book-open-variant" size={16} color={c.accent} />
            <Text style={[styles.refLabel, { color: c.accent }]}>{t('reference')}</Text>
            <MaterialCommunityIcons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={c.accent} />
          </Pressable>
          {open && (
            <View style={[styles.ref, { borderColor: c.border }]}>
              <Text style={[styles.refText, { color: c.text }]}>{dhikr.hadithReference}</Text>
              <Text style={[styles.refSource, { color: c.accent }]}>{dhikr.hadithSource}</Text>
            </View>
          )}
        </>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, borderWidth: 1.5, padding: space.lg, marginBottom: space.md, overflow: 'hidden' },
  top: { flexDirection: 'row', alignItems: 'center', minHeight: 32 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { fontSize: 12, fontWeight: '700' },
  translit: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  meaning: { fontSize: 14, textAlign: 'center', marginTop: 4, lineHeight: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.md },
  refToggle: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: space.md, minHeight: 32, gap: 4 },
  refLabel: { fontSize: 13, fontWeight: '600' },
  ref: { borderTopWidth: 1, marginTop: space.sm, paddingTop: space.sm },
  refText: { fontSize: 13, lineHeight: 20 },
  refSource: { fontSize: 12, fontWeight: '700', marginTop: 6 },
});
