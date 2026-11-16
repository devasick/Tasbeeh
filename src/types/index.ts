// Core types for the Tasbeeh app

export interface Dhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  recommendedCount: number;
  hadithReference: string;
  hadithSource: string;
  custom?: boolean;
}

export type ThemeMode = 'system' | 'light' | 'dark';
export type CounterStyle = 'ring' | 'digital';
export type Language = 'en' | 'id' | 'tr';
export type CalcMethod =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export interface AppSettings {
  theme: ThemeMode;
  counterStyle: CounterStyle;
  vibration: boolean;
  sound: boolean;
  volume: number;
  keepAwake: boolean;
  autoReset: boolean;
  arabicScale: number;
  language: Language;
  dailyGoal: number;
}

export interface Progress {
  count: number;
  target: number | null;
}

/** A finished stretch of counting on one dhikr. */
export interface Session {
  id: string;
  dhikrId: string;
  name: string;
  count: number;
  target: number | null;
  startedAt: number;
  endedAt: number;
  completed: boolean;
}

export interface ActiveSession {
  dhikrId: string;
  count: number;
  startedAt: number;
  lastAt: number;
}

export interface Reminder {
  id: string;
  hour: number;
  minute: number;
  /** 0 = Sunday … 6 = Saturday */
  days: number[];
  message: string;
  enabled: boolean;
}

export interface SavedLocation {
  lat: number;
  lng: number;
  name: string;
  source: 'device' | 'manual';
}

export interface PrayerSettings {
  method: CalcMethod;
  madhab: 'shafi' | 'hanafi';
  location: SavedLocation | null;
  notify: boolean;
  notifyBefore: number;
}

export interface AppState {
  version: 2;
  onboarded: boolean;
  customDhikr: Dhikr[];
  progress: Record<string, Progress>;
  activeId: string;
  session: ActiveSession | null;
  sessions: Session[];
  /** dayKey (YYYY-MM-DD, local) -> dhikrId -> count */
  daily: Record<string, Record<string, number>>;
  settings: AppSettings;
  reminders: Reminder[];
  prayer: PrayerSettings;
  /** Timestamp of the last target completion, drives the celebration. */
  celebrateAt: number;
}

export const PRESET_TARGETS = [33, 99, 100, 1000];
