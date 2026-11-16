import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../theme/theme';

/** Animated horizontal progress, `value` from 0 to 1. */
export const ProgressBar: React.FC<{ value: number; color?: string; height?: number }> = ({ value, color, height = 8 }) => {
  const { c } = useTheme();
  const anim = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: Math.max(0, Math.min(1, value)), duration: 300, useNativeDriver: false }).start();
  }, [value, anim]);

  return (
    <View
      style={[styles.track, { backgroundColor: c.track, height, borderRadius: height / 2 }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
    >
      <Animated.View
        style={{
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: color || c.primary,
          width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: { width: '100%', overflow: 'hidden' },
});
