import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, radius } from '../theme/theme';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
  accessibilityLabel,
}) => {
  const { c } = useTheme();
  const bg = {
    primary: c.primary,
    secondary: c.surfaceAlt,
    danger: c.danger,
    outline: 'transparent',
    ghost: 'transparent',
  }[variant];
  const fg = {
    primary: c.onPrimary,
    secondary: c.text,
    danger: c.surface,
    outline: c.primary,
    ghost: c.primary,
  }[variant];
  const pad = { small: 8, medium: 12, large: 16 }[size];
  const font = { small: 14, medium: 15, large: 17 }[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: c.primarySoft }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: bg,
          paddingVertical: pad,
          borderColor: variant === 'outline' ? c.primary : 'transparent',
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <View style={styles.row}>
          {icon && <MaterialCommunityIcons name={icon} size={font + 3} color={fg} style={{ marginRight: 6 }} />}
          <Text style={[styles.text, { color: fg, fontSize: font }]}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  text: { fontWeight: '600' },
});
