import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, radius } from '../theme/theme';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  const { c } = useTheme();
  return (
    <View
      style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}
      accessible
      accessibilityLabel={`${title}: ${value}${subtitle ? ` ${subtitle}` : ''}`}
    >
      <View style={styles.head}>
        {icon && <MaterialCommunityIcons name={icon} size={16} color={c.accent} style={{ marginRight: 6 }} />}
        <Text style={[styles.title, { color: c.textMuted }]}>{title}</Text>
      </View>
      <Text style={[styles.value, { color: c.text }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      {subtitle && <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radius.md, borderWidth: 1, padding: 14 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  title: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  value: { fontSize: 26, fontWeight: '700' },
  subtitle: { fontSize: 12, marginTop: 2 },
});
