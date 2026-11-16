import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform, useWindowDimensions } from 'react-native';
import * as Location from 'expo-location';
import Svg, { Circle, Line, Text as SvgText, G, Path } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, radius, space } from '../theme/theme';
import { useT } from '../i18n';
import { qiblaBearing } from '../utils/prayerMath';
import { lightHaptic } from '../utils/feedback';
import { SavedLocation } from '../types';

const ALIGN_DEG = 5;

/** Live compass: the rose turns with the phone, the Kaaba marker sits at the Qibla bearing. */
export const QiblaCompass: React.FC<{ location: SavedLocation; active: boolean }> = ({ location, active }) => {
  const { c } = useTheme();
  const { t } = useT();
  const { width } = useWindowDimensions();
  const size = Math.min(width - 64, 300);
  const qibla = qiblaBearing(location);
  const [heading, setHeading] = useState<number | null>(null);
  const [lowAccuracy, setLowAccuracy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rotation = useRef(new Animated.Value(0)).current;
  const continuous = useRef(0);
  const wasAligned = useRef(false);

  useEffect(() => {
    if (!active) return;
    let sub: Location.LocationSubscription | null = null;
    let cancelled = false;
    (async () => {
      try {
        const perm = await Location.requestForegroundPermissionsAsync();
        if (perm.status !== 'granted') throw new Error(t('qiblaPermission'));
        sub = await Location.watchHeadingAsync((h) => {
          const deg = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
          // Android reports accuracy 0-3; iOS reports degrees of error (negative = invalid).
          setLowAccuracy(Platform.OS === 'android' ? h.accuracy < 2 : h.accuracy < 0 || h.accuracy > 25);
          // Unwrap so the rose turns the short way across north.
          const prev = ((continuous.current % 360) + 360) % 360;
          continuous.current += ((deg - prev + 540) % 360) - 180;
          Animated.timing(rotation, { toValue: -continuous.current, duration: 150, useNativeDriver: true }).start();
          setHeading(deg);
        });
        if (cancelled) sub.remove();
      } catch (e: any) {
        setError(e?.message || t('qiblaNoSensor'));
      }
    })();
    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  const offset = heading === null ? null : ((qibla - heading + 540) % 360) - 180;
  const aligned = offset !== null && Math.abs(offset) <= ALIGN_DEG;
  useEffect(() => {
    if (aligned && !wasAligned.current) lightHaptic();
    wasAligned.current = aligned;
  }, [aligned]);

  if (error) {
    return (
      <View style={[styles.notice, { backgroundColor: c.surfaceAlt }]}>
        <MaterialCommunityIcons name="compass-off-outline" size={28} color={c.textMuted} />
        <Text style={{ color: c.text, marginTop: 8, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  const r = size / 2;
  const rot = rotation.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'], extrapolate: 'extend' });
  const kx = r + Math.sin((qibla * Math.PI) / 180) * (r - 30);
  const ky = r - Math.cos((qibla * Math.PI) / 180) * (r - 30);

  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[styles.status, { color: aligned ? c.primary : c.text }]} accessibilityLiveRegion="polite">
        {heading === null ? t('qiblaWaiting') : aligned ? t('qiblaAligned') : offset! > 0 ? t('qiblaTurnRight', { deg: Math.round(offset!) }) : t('qiblaTurnLeft', { deg: Math.round(-offset!) })}
      </Text>
      <View style={{ width: size, height: size + 16, alignItems: 'center' }}>
        <MaterialCommunityIcons name="menu-down" size={36} color={aligned ? c.primary : c.accent} style={{ marginBottom: -14, zIndex: 1 }} />
        <Animated.View style={{ width: size, height: size, transform: [{ rotate: rot }] }}>
          <Svg width={size} height={size}>
            <Circle cx={r} cy={r} r={r - 2} fill={c.surface} stroke={aligned ? c.primary : c.border} strokeWidth={aligned ? 3 : 1.5} />
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i * 5 * Math.PI) / 180;
              const len = i % 18 === 0 ? 14 : i % 3 === 0 ? 8 : 4;
              return (
                <Line
                  key={i}
                  x1={r + Math.sin(a) * (r - 6)}
                  y1={r - Math.cos(a) * (r - 6)}
                  x2={r + Math.sin(a) * (r - 6 - len)}
                  y2={r - Math.cos(a) * (r - 6 - len)}
                  stroke={i % 18 === 0 ? c.text : c.textMuted}
                  strokeWidth={i % 18 === 0 ? 2 : 1}
                />
              );
            })}
            {['N', 'E', 'S', 'W'].map((d, i) => {
              const a = (i * 90 * Math.PI) / 180;
              return (
                <SvgText
                  key={d}
                  x={r + Math.sin(a) * (r - 34)}
                  y={r - Math.cos(a) * (r - 34) + 6}
                  fontSize={16}
                  fontWeight="700"
                  fill={d === 'N' ? c.danger : c.text}
                  textAnchor="middle"
                >
                  {d}
                </SvgText>
              );
            })}
            <G>
              <Line x1={r} y1={r} x2={kx} y2={ky} stroke={c.accent} strokeWidth={3} strokeLinecap="round" />
              <Circle cx={r} cy={r} r={6} fill={c.accent} />
              <Path d={`M ${kx - 11} ${ky - 11} h 22 v 22 h -22 Z`} fill={c.text} />
              <Path d={`M ${kx - 11} ${ky - 5} h 22`} stroke={c.accent} strokeWidth={2} />
            </G>
          </Svg>
        </Animated.View>
      </View>
      <Text style={{ color: c.textMuted, marginTop: space.md }}>{t('qiblaBearing', { deg: Math.round(qibla) })}</Text>
      {lowAccuracy && (
        <View style={[styles.notice, { backgroundColor: c.accentSoft, marginTop: space.md }]}>
          <MaterialCommunityIcons name="rotate-3d-variant" size={24} color={c.accent} />
          <Text style={{ color: c.text, marginTop: 6, textAlign: 'center' }}>{t('qiblaCalibrate')}</Text>
        </View>
      )}
      <Text style={{ color: c.textMuted, fontSize: 12, marginTop: space.md, textAlign: 'center' }}>{t('qiblaTip')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  status: { fontSize: 17, fontWeight: '700', marginBottom: space.md, textAlign: 'center' },
  notice: { alignItems: 'center', padding: space.lg, borderRadius: radius.md, width: '100%' },
});
