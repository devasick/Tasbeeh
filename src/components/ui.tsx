// Small shared building blocks so every screen looks and behaves the same.
import React, { ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  Switch,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, radius, space } from '../theme/theme';

export type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export const Screen: React.FC<{
  title: string;
  subtitle?: string;
  right?: ReactNode;
  scroll?: boolean;
  children: ReactNode;
}> = ({ title, subtitle, right, scroll = true, children }) => {
  const { c } = useTheme();
  const header = (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: c.text }]} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: c.bg }}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {header}
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }]}>
          {header}
          {children}
        </View>
      )}
    </SafeAreaView>
  );
};

export const Card: React.FC<{ children: ReactNode; style?: ViewStyle; tint?: boolean }> = ({ children, style, tint }) => {
  const { c } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: tint ? c.primarySoft : c.surface, borderColor: tint ? 'transparent' : c.border },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const SectionTitle: React.FC<{ children: ReactNode; right?: ReactNode }> = ({ children, right }) => {
  const { c } = useTheme();
  return (
    <View style={styles.sectionRow}>
      <Text style={[styles.sectionTitle, { color: c.textMuted }]} accessibilityRole="header">
        {children}
      </Text>
      {right}
    </View>
  );
};

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const { c } = useTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: c.surfaceAlt }]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={String(o.value)}
            onPress={() => onChange(o.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.segment, on && { backgroundColor: c.surface, elevation: 1 }]}
          >
            <Text style={[styles.segmentText, { color: on ? c.primary : c.textMuted }]} numberOfLines={1}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const Chip: React.FC<{ label: string; selected?: boolean; onPress: () => void; icon?: IconName }> = ({
  label,
  selected,
  onPress,
  icon,
}) => {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[
        styles.chip,
        { backgroundColor: selected ? c.primary : c.surface, borderColor: selected ? c.primary : c.border },
      ]}
    >
      {icon && <MaterialCommunityIcons name={icon} size={16} color={selected ? c.onPrimary : c.textMuted} />}
      <Text style={[styles.chipText, { color: selected ? c.onPrimary : c.text }]}>{label}</Text>
    </Pressable>
  );
};

export const IconButton: React.FC<{
  icon: IconName;
  label: string;
  onPress: () => void;
  color?: string;
  size?: number;
  disabled?: boolean;
}> = ({ icon, label, onPress, color, size = 22, disabled }) => {
  const { c } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, { opacity: disabled ? 0.35 : pressed ? 0.6 : 1 }]}
    >
      <MaterialCommunityIcons name={icon} size={size} color={color || c.textMuted} />
    </Pressable>
  );
};

export const SettingRow: React.FC<{
  label: string;
  description?: string;
  icon?: IconName;
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  onPress?: () => void;
  right?: ReactNode;
}> = ({ label, description, icon, value, onValueChange, onPress, right }) => {
  const { c } = useTheme();
  const body = (
    <View style={styles.settingRow}>
      {icon && <MaterialCommunityIcons name={icon} size={22} color={c.primary} style={{ marginRight: 14 }} />}
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingLabel, { color: c.text }]}>{label}</Text>
        {description ? <Text style={[styles.settingDesc, { color: c.textMuted }]}>{description}</Text> : null}
      </View>
      {onValueChange && (
        <Switch
          value={!!value}
          onValueChange={onValueChange}
          accessibilityLabel={label}
          trackColor={{ false: c.track, true: c.primary }}
          thumbColor={c.surface}
        />
      )}
      {right}
      {onPress && !right && <MaterialCommunityIcons name="chevron-right" size={22} color={c.textMuted} />}
    </View>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" android_ripple={{ color: c.primarySoft }}>
      {body}
    </Pressable>
  ) : (
    body
  );
};

export const Divider = () => {
  const { c } = useTheme();
  return <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: c.border, marginVertical: 2 }} />;
};

export const EmptyState: React.FC<{ icon: IconName; title: string; text: string; action?: ReactNode }> = ({
  icon,
  title,
  text,
  action,
}) => {
  const { c } = useTheme();
  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: c.primarySoft }]}>
        <MaterialCommunityIcons name={icon} size={30} color={c.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: c.text }]}>{title}</Text>
      <Text style={[styles.emptyText, { color: c.textMuted }]}>{text}</Text>
      {action}
    </View>
  );
};

/** Bottom sheet; the Android back button closes it via onRequestClose. */
export const Sheet: React.FC<{ visible: boolean; onClose: () => void; title: string; children: ReactNode }> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  const { c } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable style={[styles.backdrop, { backgroundColor: c.overlay }]} onPress={onClose} accessibilityLabel="Close" />
        <SafeAreaView edges={['bottom']} style={[styles.sheet, { backgroundColor: c.bg }]}>
          <View style={[styles.grabber, { backgroundColor: c.border }]} />
          <View style={styles.sheetHead}>
            <Text style={[styles.sheetTitle, { color: c.text }]} accessibilityRole="header">
              {title}
            </Text>
            <IconButton icon="close" label="Close" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: space.lg }}>
            {children}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const Stepper: React.FC<{
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  minusLabel: string;
  plusLabel: string;
}> = ({ value, onMinus, onPlus, minusLabel, plusLabel }) => {
  const { c } = useTheme();
  return (
    <View style={styles.stepper}>
      <IconButton icon="minus-circle-outline" label={minusLabel} onPress={onMinus} color={c.primary} size={28} />
      <Text style={[styles.stepperValue, { color: c.text }]}>{value}</Text>
      <IconButton icon="plus-circle-outline" label={plusLabel} onPress={onPlus} color={c.primary} size={28} />
    </View>
  );
};

export const styles = StyleSheet.create({
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxl },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: space.lg, paddingBottom: space.md },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 14, marginTop: 2 },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: space.lg, marginBottom: space.md },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.lg, marginBottom: space.sm },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
  segmented: { flexDirection: 'row', borderRadius: radius.pill, padding: 4 },
  segment: { flex: 1, minHeight: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segmentText: { fontSize: 14, fontWeight: '600' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: space.sm,
    marginBottom: space.sm,
  },
  chipText: { fontSize: 14, fontWeight: '600' },
  iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  settingRow: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingVertical: 8 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  settingDesc: { fontSize: 13, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: space.xxl, paddingHorizontal: space.xl },
  emptyIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: space.md },
  backdrop: { flex: 1 },
  sheet: { borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: space.lg, maxHeight: '88%' },
  grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginTop: 8 },
  sheetHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: space.sm },
  sheetTitle: { fontSize: 20, fontWeight: '700' },
  stepper: { flexDirection: 'row', alignItems: 'center' },
  stepperValue: { fontSize: 18, fontWeight: '700', minWidth: 64, textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, marginBottom: space.md },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
});
