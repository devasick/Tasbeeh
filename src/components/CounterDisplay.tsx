import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme, radius } from '../theme/theme';
import { CounterStyle } from '../types';
import { ProgressBar } from './ProgressBar';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  count: number;
  target: number | null;
  style: CounterStyle;
  onPress: () => void;
  label: string;
  hint: string;
  maxHeight: number;
}

/** The tappable counter, drawn as a ring or as a digital display. */
export const CounterDisplay: React.FC<Props> = ({ count, target, style, onPress, label, hint, maxHeight }) => {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const pulse = useRef(new Animated.Value(1)).current;
  const progress = target ? Math.min(1, count / target) : 0;
  const arc = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(arc, { toValue: progress, duration: 250, useNativeDriver: false }).start();
  }, [progress, arc]);

  const press = () => {
    pulse.setValue(0.96);
    Animated.spring(pulse, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
    onPress();
  };

  const a11y = {
    accessibilityRole: 'button' as const,
    accessibilityLabel: `${label}: ${count}${target ? ` / ${target}` : ''}`,
    accessibilityHint: hint,
  };

  if (style === 'digital') {
    const panelW = Math.min(width - 48, 380);
    const button = Math.max(96, Math.min(150, maxHeight - 200));
    return (
      <View style={{ alignItems: 'center' }}>
        <View style={[styles.lcd, { width: panelW, backgroundColor: c.surfaceAlt, borderColor: c.border }]}>
          <Text style={[styles.lcdCount, { color: c.text }]} adjustsFontSizeToFit numberOfLines={1}>
            {String(count).padStart(4, '0')}
          </Text>
          <View style={styles.lcdFoot}>
            <Text style={{ color: c.textMuted, fontWeight: '600' }}>{target ? `/ ${target}` : '∞'}</Text>
            {target ? <Text style={{ color: c.accent, fontWeight: '700' }}>{Math.round(progress * 100)}%</Text> : null}
          </View>
          {target ? <ProgressBar value={progress} color={c.accent} height={6} /> : null}
        </View>
        <Animated.View style={{ transform: [{ scale: pulse }], marginTop: 20 }}>
          <Pressable
            {...a11y}
            onPress={press}
            android_ripple={{ color: c.primarySoft, borderless: true }}
            style={[styles.bigButton, { width: button, height: button, borderRadius: button / 2, backgroundColor: c.primary }]}
          >
            <View style={[styles.bigInner, { borderColor: c.onPrimary, width: button - 22, height: button - 22, borderRadius: button }]} />
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  const size = Math.max(200, Math.min(width - 56, maxHeight, 340));
  const stroke = 12;
  const r = size / 2 - stroke;
  const circ = 2 * Math.PI * r;
  const beads = 33;

  return (
    <Animated.View style={{ transform: [{ scale: pulse }] }}>
      <Pressable {...a11y} onPress={press} style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="arc" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={c.primary} />
              <Stop offset="1" stopColor={c.accent} />
            </LinearGradient>
          </Defs>
          <Circle cx={size / 2} cy={size / 2} r={r - stroke - 6} fill={c.surface} stroke={c.border} strokeWidth={1} />
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.track} strokeWidth={stroke} fill="none" />
          {Array.from({ length: beads }, (_, i) => {
            const ang = (i / beads) * 2 * Math.PI - Math.PI / 2;
            const lit = target ? i < Math.round(progress * beads) : (count % beads) > i;
            return (
              <Circle
                key={i}
                cx={size / 2 + Math.cos(ang) * (r - stroke - 18)}
                cy={size / 2 + Math.sin(ang) * (r - stroke - 18)}
                r={2.6}
                fill={lit ? c.accent : c.track}
              />
            );
          })}
          {target ? (
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke="url(#arc)"
              strokeWidth={stroke}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${circ} ${circ}`}
              strokeDashoffset={arc.interpolate({ inputRange: [0, 1], outputRange: [circ, 0] })}
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          ) : null}
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.center]} pointerEvents="none">
          <Text style={[styles.count, { color: c.text, fontSize: size * 0.24 }]} adjustsFontSizeToFit numberOfLines={1}>
            {count}
          </Text>
          <Text style={[styles.target, { color: c.textMuted }]}>{target ? `/ ${target}` : '∞'}</Text>
          {target ? <Text style={[styles.percent, { color: c.accent }]}>{Math.round(progress * 100)}%</Text> : null}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  count: { fontWeight: '700', fontVariant: ['tabular-nums'] },
  target: { fontSize: 16, fontWeight: '600', marginTop: -4 },
  percent: { fontSize: 13, fontWeight: '700', marginTop: 4, letterSpacing: 1 },
  lcd: { borderRadius: radius.lg, borderWidth: 1, paddingVertical: 18, paddingHorizontal: 22 },
  lcdCount: { fontSize: 76, fontWeight: '300', textAlign: 'center', fontVariant: ['tabular-nums'], letterSpacing: 6 },
  lcdFoot: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bigButton: { alignItems: 'center', justifyContent: 'center', elevation: 4 },
  bigInner: { borderWidth: 2, opacity: 0.35 },
});
