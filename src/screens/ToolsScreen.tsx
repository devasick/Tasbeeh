import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator, Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useTheme, space, radius } from '../theme/theme';
import { useT } from '../i18n';
import { CITIES } from '../data/cities';
import { CALC_METHODS, nextPrayer, prayerTimesFor } from '../utils/prayerMath';
import { getDeviceLocation } from '../utils/location';
import { requestNotificationPermission } from '../utils/notifications';
import { Screen, Card, Segmented, Sheet, SettingRow, Chip, SectionTitle, Divider, styles as ui } from '../components/ui';
import { Button } from '../components/Button';
import { QiblaCompass } from '../components/QiblaCompass';

export const ToolsScreen: React.FC = () => {
  const { state, dispatch } = useApp();
  const { c } = useTheme();
  const { t, formatTime, formatDay } = useT();
  const focused = useIsFocused();
  const { prayer } = state;
  const [tool, setTool] = useState<'prayer' | 'qibla'>('prayer');
  const [locating, setLocating] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!focused) return;
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, [focused]);

  const useDevice = async () => {
    setLocating(true);
    try {
      const location = await getDeviceLocation();
      dispatch({ type: 'updatePrayer', prayer: { location } });
    } catch (e: any) {
      if (e?.message === 'denied') {
        Alert.alert(t('locationDeniedTitle'), t('locationDeniedBody'), [
          { text: t('cancel'), style: 'cancel' },
          { text: t('chooseCity'), onPress: () => setCityOpen(true) },
          { text: t('openSettings'), onPress: () => Linking.openSettings() },
        ]);
      } else {
        Alert.alert(t('locationErrorTitle'), t('locationErrorBody'));
      }
    } finally {
      setLocating(false);
    }
  };

  const toggleNotify = async (on: boolean) => {
    if (on && !(await requestNotificationPermission())) {
      Alert.alert(t('notifDeniedTitle'), t('notifDeniedBody'), [
        { text: t('cancel'), style: 'cancel' },
        { text: t('openSettings'), onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    dispatch({ type: 'updatePrayer', prayer: { notify: on } });
  };

  const loc = prayer.location;
  const times = useMemo(
    () => (loc ? prayerTimesFor(now, loc, prayer.method, prayer.madhab) : []),
    // Recompute when the day or settings change; `now` ticks every 30s.
    [loc, prayer.method, prayer.madhab, now.toDateString()] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const next = loc ? nextPrayer(now, loc, prayer.method, prayer.madhab) : null;
  const minsLeft = next ? Math.max(0, Math.round((next.time.getTime() - now.getTime()) / 60000)) : 0;
  const cities = CITIES.filter((x) => `${x.name} ${x.country}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Screen title={t('tabTools')} subtitle={formatDay(now.getTime())}>
      <Segmented
        value={tool}
        onChange={setTool}
        options={[
          { value: 'prayer', label: t('prayerTimes') },
          { value: 'qibla', label: t('qibla') },
        ]}
      />

      <Card style={{ marginTop: space.lg }}>
        <View style={styles.locRow}>
          <MaterialCommunityIcons name="map-marker" size={22} color={c.primary} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: c.textMuted, fontSize: 12 }}>{t('location')}</Text>
            <Text style={{ color: c.text, fontWeight: '600', fontSize: 16 }} numberOfLines={1}>
              {loc ? loc.name : t('noLocation')}
            </Text>
          </View>
        </View>
        {!loc && <Text style={{ color: c.textMuted, marginVertical: space.sm, lineHeight: 20 }}>{t('locationExplain')}</Text>}
        <View style={styles.locButtons}>
          <Button
            title={t('useMyLocation')}
            icon="crosshairs-gps"
            size="small"
            onPress={useDevice}
            loading={locating}
            style={{ flex: 1, marginRight: space.sm }}
          />
          <Button title={t('chooseCity')} icon="city-variant-outline" size="small" variant="outline" onPress={() => setCityOpen(true)} style={{ flex: 1 }} />
        </View>
      </Card>

      {loc && tool === 'prayer' && (
        <>
          {next && (
            <Card tint>
              <Text style={{ color: c.textMuted, fontSize: 13 }}>{t('nextPrayer')}</Text>
              <View style={styles.nextRow}>
                <Text style={[styles.nextName, { color: c.text }]}>{t(next.key)}</Text>
                <Text style={[styles.nextTime, { color: c.primary }]}>{formatTime(next.time)}</Text>
              </View>
              <Text style={{ color: c.textMuted }}>
                {t('inTime', { h: Math.floor(minsLeft / 60), m: minsLeft % 60 })}
              </Text>
            </Card>
          )}
          <Card style={{ paddingVertical: space.sm }}>
            {times.map((p, i) => {
              const isNext = next && p.key === next.key && p.time.getTime() === next.time.getTime();
              return (
                <View key={p.key}>
                  {i > 0 && <Divider />}
                  <View style={[styles.timeRow, isNext && { backgroundColor: c.primarySoft, marginHorizontal: -space.sm, paddingHorizontal: space.sm, borderRadius: radius.sm }]}>
                    <MaterialCommunityIcons
                      name={p.key === 'sunrise' ? 'weather-sunset-up' : isNext ? 'bell-ring-outline' : 'clock-outline'}
                      size={20}
                      color={isNext ? c.primary : c.textMuted}
                    />
                    <Text style={[styles.timeName, { color: p.key === 'sunrise' ? c.textMuted : c.text }]}>{t(p.key)}</Text>
                    <Text style={[styles.timeValue, { color: isNext ? c.primary : c.text }]}>{formatTime(p.time)}</Text>
                  </View>
                </View>
              );
            })}
          </Card>

          <SectionTitle>{t('prayerSettings')}</SectionTitle>
          <Card>
            <SettingRow
              icon="calculator-variant-outline"
              label={t('calcMethod')}
              description={CALC_METHODS.find((m) => m.value === prayer.method)?.label}
              onPress={() => setMethodOpen(true)}
            />
            <Divider />
            <Text style={[ui.label, { color: c.textMuted, marginTop: space.md }]}>{t('asrMethod')}</Text>
            <Segmented
              value={prayer.madhab}
              onChange={(madhab) => dispatch({ type: 'updatePrayer', prayer: { madhab } })}
              options={[
                { value: 'shafi', label: t('asrStandard') },
                { value: 'hanafi', label: t('asrHanafi') },
              ]}
            />
            <View style={{ height: space.md }} />
            <Divider />
            <SettingRow icon="bell-outline" label={t('prayerAlerts')} description={t('prayerAlertsDesc')} value={prayer.notify} onValueChange={toggleNotify} />
            {prayer.notify && (
              <View style={styles.chips}>
                {[5, 10, 15, 30].map((m) => (
                  <Chip
                    key={m}
                    label={t('minutesBefore', { m })}
                    selected={prayer.notifyBefore === m}
                    onPress={() => dispatch({ type: 'updatePrayer', prayer: { notifyBefore: m } })}
                  />
                ))}
              </View>
            )}
          </Card>
        </>
      )}

      {loc && tool === 'qibla' && (
        <Card>
          <QiblaCompass location={loc} active={focused && tool === 'qibla'} />
        </Card>
      )}

      <Sheet visible={cityOpen} onClose={() => setCityOpen(false)} title={t('chooseCity')}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('searchCity')}
          placeholderTextColor={c.textMuted}
          accessibilityLabel={t('searchCity')}
          style={[ui.input, { color: c.text, borderColor: c.border, backgroundColor: c.surface }]}
        />
        {cities.length === 0 && <Text style={{ color: c.textMuted, textAlign: 'center', padding: space.lg }}>{t('noCityFound')}</Text>}
        {cities.map((city) => (
          <Pressable
            key={`${city.name}-${city.country}`}
            accessibilityRole="button"
            onPress={() => {
              dispatch({
                type: 'updatePrayer',
                prayer: { location: { lat: city.lat, lng: city.lng, name: `${city.name}, ${city.country}`, source: 'manual' } },
              });
              setCityOpen(false);
              setQuery('');
            }}
            style={styles.cityRow}
          >
            <Text style={{ color: c.text, fontSize: 16 }}>{city.name}</Text>
            <Text style={{ color: c.textMuted }}>{city.country}</Text>
          </Pressable>
        ))}
      </Sheet>

      <Sheet visible={methodOpen} onClose={() => setMethodOpen(false)} title={t('calcMethod')}>
        {CALC_METHODS.map((m) => (
          <Pressable
            key={m.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: m.value === prayer.method }}
            onPress={() => {
              dispatch({ type: 'updatePrayer', prayer: { method: m.value } });
              setMethodOpen(false);
            }}
            style={styles.cityRow}
          >
            <Text style={{ color: c.text, fontSize: 16, flex: 1 }}>{m.label}</Text>
            {m.value === prayer.method && <MaterialCommunityIcons name="check" size={22} color={c.primary} />}
          </Pressable>
        ))}
      </Sheet>

      {locating && !loc && <ActivityIndicator color={c.primary} style={{ marginTop: space.lg }} />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  locRow: { flexDirection: 'row', alignItems: 'center' },
  locButtons: { flexDirection: 'row', marginTop: space.md },
  nextRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginVertical: 4 },
  nextName: { fontSize: 26, fontWeight: '700' },
  nextTime: { fontSize: 26, fontWeight: '700' },
  timeRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52 },
  timeName: { flex: 1, fontSize: 16, fontWeight: '600', marginLeft: 12 },
  timeValue: { fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space.sm },
  cityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, paddingVertical: 6 },
});
