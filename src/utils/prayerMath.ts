// Offline prayer time and Qibla maths (pure, unit-tested).
import { Coordinates, CalculationMethod, PrayerTimes, Qibla, HighLatitudeRule } from 'adhan';
import { CalcMethod } from '../types';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
export const PRAYER_KEYS: PrayerKey[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
/** Sunrise is shown but is not a prayer, so it never gets an alert. */
export const NOTIFY_KEYS: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const CALC_METHODS: { value: CalcMethod; label: string }[] = [
  { value: 'MuslimWorldLeague', label: 'Muslim World League' },
  { value: 'Egyptian', label: 'Egyptian General Authority' },
  { value: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { value: 'UmmAlQura', label: 'Umm al-Qura, Makkah' },
  { value: 'Dubai', label: 'Dubai' },
  { value: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { value: 'NorthAmerica', label: 'ISNA (North America)' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Singapore', label: 'Singapore, Malaysia, Indonesia' },
  { value: 'Tehran', label: 'Tehran' },
  { value: 'Turkey', label: 'Diyanet, Turkey' },
];

export const prayerTimesFor = (
  date: Date,
  loc: { lat: number; lng: number },
  method: CalcMethod,
  madhab: 'shafi' | 'hanafi'
): { key: PrayerKey; time: Date }[] => {
  const coords = new Coordinates(loc.lat, loc.lng);
  const params = CalculationMethod[method]();
  params.madhab = madhab;
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  const t = new PrayerTimes(coords, date, params);
  return PRAYER_KEYS.map((key) => ({ key, time: t[key] }));
};

export const qiblaBearing = (loc: { lat: number; lng: number }): number => Qibla(new Coordinates(loc.lat, loc.lng));

/** The next prayer (not sunrise) after `now`, looking into tomorrow if needed. */
export const nextPrayer = (
  now: Date,
  loc: { lat: number; lng: number },
  method: CalcMethod,
  madhab: 'shafi' | 'hanafi'
) => {
  for (let offset = 0; offset < 2; offset++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const hit = prayerTimesFor(day, loc, method, madhab).find(
      (p) => p.key !== 'sunrise' && p.time.getTime() > now.getTime()
    );
    if (hit) return hit;
  }
  return null;
};
