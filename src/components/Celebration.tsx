import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, AccessibilityInfo } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, radius } from '../theme/theme';

const SPARKS = 12;

/** Short, non-blocking celebration shown when a target is reached. */
export const Celebration: React.FC<{ trigger: number; title: string; subtitle: string }> = ({ trigger, title, subtitle }) => {
  const { c } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const seen = useRef(trigger);

  useEffect(() => {
    if (!trigger || trigger === seen.current) return;
    seen.current = trigger;
    AccessibilityInfo.announceForAccessibility(`${title}. ${subtitle}`);
    anim.setValue(0);
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.delay(1300),
      Animated.timing(anim, { toValue: 2, duration: 350, useNativeDriver: true }),
    ]).start();
  }, [trigger]); // eslint-disable-line react-hooks/exhaustive-deps

  const opacity = anim.interpolate({ inputRange: [0, 0.3, 1, 1.7, 2], outputRange: [0, 1, 1, 1, 0] });
  const scale = anim.interpolate({ inputRange: [0, 1, 2], outputRange: [0.7, 1, 1.05] });
  const burst = anim.interpolate({ inputRange: [0, 1, 2], outputRange: [0, 1, 1.2] });

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.center, { opacity }]}>
      {Array.from({ length: SPARKS }, (_, i) => {
        const ang = (i / SPARKS) * 2 * Math.PI;
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              transform: [
                { translateX: Animated.multiply(burst, Math.cos(ang) * 150) },
                { translateY: Animated.multiply(burst, Math.sin(ang) * 150) },
              ],
            }}
          >
            <MaterialCommunityIcons name="star-four-points" size={i % 2 ? 14 : 22} color={i % 3 ? c.accent : c.primary} />
          </Animated.View>
        );
      })}
      <Animated.View style={[styles.card, { backgroundColor: c.surface, borderColor: c.accent, transform: [{ scale }] }]}>
        <View style={[styles.badge, { backgroundColor: c.accentSoft }]}>
          <MaterialCommunityIcons name="check-decagram" size={34} color={c.accent} />
        </View>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: c.textMuted }]}>{subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  card: { alignItems: 'center', paddingVertical: 22, paddingHorizontal: 30, borderRadius: radius.lg, borderWidth: 1.5, elevation: 8 },
  badge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
});
