// Pure app state: reducer, v1 migration and statistics. No React Native imports, so it is unit-testable.
import { AppState, AppSettings, Dhikr, Progress, Reminder, PrayerSettings, Session } from '../types';
import { PREDEFINED_DHIKR } from '../data/dhikrData';

export const IDLE_SESSION_MS = 30 * 60 * 1000;
const MAX_SESSIONS = 500;
const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  counterStyle: 'ring',
  vibration: true,
  sound: false,
  volume: 0.6,
  keepAwake: false,
  autoReset: false,
  arabicScale: 1,
  language: 'en',
  dailyGoal: 300,
};

export const DEFAULT_PRAYER: PrayerSettings = {
  method: 'MuslimWorldLeague',
  madhab: 'shafi',
  location: null,
  notify: false,
  notifyBefore: 10,
};

export const initialState = (): AppState => ({
  version: 2,
  onboarded: false,
  customDhikr: [],
  progress: {},
  activeId: PREDEFINED_DHIKR[0].id,
  session: null,
  sessions: [],
  daily: {},
  settings: DEFAULT_SETTINGS,
  reminders: [],
  prayer: DEFAULT_PRAYER,
  celebrateAt: 0,
});

export const dayKey = (ts: number): string => {
  const d = new Date(ts);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const allDhikr = (s: AppState): Dhikr[] => [...PREDEFINED_DHIKR, ...s.customDhikr];

export const findDhikr = (s: AppState, id: string): Dhikr | undefined => allDhikr(s).find((d) => d.id === id);

export const getProgress = (s: AppState, id: string): Progress => {
  const p = s.progress[id];
  if (p) return p;
  const d = findDhikr(s, id);
  return { count: 0, target: d ? d.recommendedCount : null };
};

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'increment'; now: number }
  | { type: 'undo'; now: number }
  | { type: 'reset'; now: number }
  | { type: 'select'; id: string; now: number }
  | { type: 'setTarget'; id: string; target: number | null }
  | { type: 'endIdleSession'; now: number }
  | { type: 'saveDhikr'; dhikr: Dhikr }
  | { type: 'deleteDhikr'; id: string; now: number }
  | { type: 'deleteSession'; id: string }
  | { type: 'updateSettings'; settings: Partial<AppSettings> }
  | { type: 'updatePrayer'; prayer: Partial<PrayerSettings> }
  | { type: 'saveReminder'; reminder: Reminder }
  | { type: 'deleteReminder'; id: string }
  | { type: 'finishOnboarding'; dailyGoal: number }
  | { type: 'restartOnboarding' };

const addDaily = (daily: AppState['daily'], key: string, id: string, delta: number) => {
  const day = daily[key] || {};
  const next = Math.max(0, (day[id] || 0) + delta);
  return { ...daily, [key]: { ...day, [id]: next } };
};

/** Moves the running session (if any) into the session log. */
const endSession = (s: AppState, now: number, completed = false): AppState => {
  const run = s.session;
  if (!run) return s;
  if (run.count <= 0) return { ...s, session: null };
  const d = findDhikr(s, run.dhikrId);
  const entry: Session = {
    id: `${run.startedAt}-${run.dhikrId}`,
    dhikrId: run.dhikrId,
    name: d ? d.transliteration : 'Dhikr',
    count: run.count,
    target: getProgress(s, run.dhikrId).target,
    startedAt: run.startedAt,
    endedAt: run.lastAt,
    completed,
  };
  return { ...s, session: null, sessions: [entry, ...s.sessions].slice(0, MAX_SESSIONS) };
};

export const reducer = (s: AppState, a: Action): AppState => {
  switch (a.type) {
    case 'hydrate':
      return a.state;

    case 'increment': {
      const id = s.activeId;
      let next = s;
      if (next.session && (next.session.dhikrId !== id || a.now - next.session.lastAt > IDLE_SESSION_MS)) {
        next = endSession(next, a.now);
      }
      const run = next.session || { dhikrId: id, count: 0, startedAt: a.now, lastAt: a.now };
      const p = getProgress(next, id);
      const count = p.count + 1;
      next = {
        ...next,
        session: { ...run, count: run.count + 1, lastAt: a.now },
        progress: { ...next.progress, [id]: { ...p, count } },
        daily: addDaily(next.daily, dayKey(a.now), id, 1),
      };
      if (p.target && count === p.target) {
        next = { ...endSession(next, a.now, true), celebrateAt: a.now };
      }
      return next;
    }

    case 'undo': {
      const id = s.activeId;
      const p = getProgress(s, id);
      if (p.count <= 0) return s;
      const run = s.session && s.session.dhikrId === id && s.session.count > 0
        ? { ...s.session, count: s.session.count - 1 }
        : s.session;
      return {
        ...s,
        session: run,
        progress: { ...s.progress, [id]: { ...p, count: p.count - 1 } },
        daily: addDaily(s.daily, dayKey(a.now), id, -1),
      };
    }

    case 'reset': {
      const next = endSession(s, a.now);
      const p = getProgress(next, s.activeId);
      return { ...next, progress: { ...next.progress, [s.activeId]: { ...p, count: 0 } } };
    }

    case 'select':
      if (a.id === s.activeId || !findDhikr(s, a.id)) return s;
      return { ...endSession(s, a.now), activeId: a.id };

    case 'setTarget': {
      const p = getProgress(s, a.id);
      return { ...s, progress: { ...s.progress, [a.id]: { ...p, target: a.target } } };
    }

    case 'endIdleSession':
      return s.session && a.now - s.session.lastAt > IDLE_SESSION_MS ? endSession(s, a.now) : s;

    case 'saveDhikr': {
      const exists = s.customDhikr.some((d) => d.id === a.dhikr.id);
      const customDhikr = exists
        ? s.customDhikr.map((d) => (d.id === a.dhikr.id ? a.dhikr : d))
        : [...s.customDhikr, a.dhikr];
      return { ...s, customDhikr };
    }

    case 'deleteDhikr': {
      if (!s.customDhikr.some((d) => d.id === a.id)) return s;
      let next = s.session?.dhikrId === a.id ? endSession(s, a.now) : s;
      const { [a.id]: _removed, ...progress } = next.progress;
      next = { ...next, customDhikr: next.customDhikr.filter((d) => d.id !== a.id), progress };
      if (next.activeId === a.id) next = { ...next, activeId: PREDEFINED_DHIKR[0].id };
      return next;
    }

    case 'deleteSession': {
      const entry = s.sessions.find((x) => x.id === a.id);
      if (!entry) return s;
      return {
        ...s,
        sessions: s.sessions.filter((x) => x.id !== a.id),
        daily: addDaily(s.daily, dayKey(entry.startedAt), entry.dhikrId, -entry.count),
      };
    }

    case 'updateSettings':
      return { ...s, settings: { ...s.settings, ...a.settings } };

    case 'updatePrayer':
      return { ...s, prayer: { ...s.prayer, ...a.prayer } };

    case 'saveReminder': {
      const exists = s.reminders.some((r) => r.id === a.reminder.id);
      const reminders = exists
        ? s.reminders.map((r) => (r.id === a.reminder.id ? a.reminder : r))
        : [...s.reminders, a.reminder];
      return { ...s, reminders };
    }

    case 'deleteReminder':
      return { ...s, reminders: s.reminders.filter((r) => r.id !== a.id) };

    case 'finishOnboarding':
      return { ...s, onboarded: true, settings: { ...s.settings, dailyGoal: a.dailyGoal } };

    case 'restartOnboarding':
      return { ...s, onboarded: false };
  }
};

/** Fills fields added after a state was saved, so older saves keep loading. */
export const normalize = (raw: Partial<AppState>): AppState => {
  const base = initialState();
  return {
    ...base,
    ...raw,
    version: 2,
    settings: { ...base.settings, ...(raw.settings || {}) },
    prayer: { ...base.prayer, ...(raw.prayer || {}) },
  };
};

// ---------- Migration from the v1 storage layout ----------

interface V1Counter { id: string; name: string; currentCount: number; goal: number | null; createdAt?: number }
interface V1History { id: string; counterId: string; counterName: string; count: number; goal: number | null; completedAt: number }
interface V1Settings { vibrationEnabled?: boolean; soundEnabled?: boolean; soundVolume?: number; darkMode?: boolean | 'auto'; autoResetAfterGoal?: boolean }

export interface V1Data {
  counters: string | null;
  history: string | null;
  settings: string | null;
  dhikrCounts: string | null;
}

const parse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
};

export const migrateV1 = (v1: V1Data): AppState => {
  const s = initialState();
  const counters = parse<V1Counter[]>(v1.counters, []);
  const history = parse<V1History[]>(v1.history, []);
  const old = parse<V1Settings | null>(v1.settings, null);
  const dhikrCounts = parse<Record<string, number>>(v1.dhikrCounts, {});

  const customDhikr: Dhikr[] = counters.map((c) => ({
    id: `c-${c.id}`,
    arabicText: '',
    transliteration: c.name,
    meaning: '',
    recommendedCount: c.goal || 33,
    hadithReference: '',
    hadithSource: '',
    custom: true,
  }));
  const progress: AppState['progress'] = {};
  counters.forEach((c) => {
    progress[`c-${c.id}`] = { count: c.currentCount || 0, target: c.goal };
  });
  PREDEFINED_DHIKR.forEach((d) => {
    if (dhikrCounts[d.id]) progress[d.id] = { count: dhikrCounts[d.id], target: d.recommendedCount };
  });

  let daily: AppState['daily'] = {};
  const sessions: Session[] = history.map((h) => {
    // v1 logged entries only on reaching the goal, but stored the count one short of it.
    const count = h.goal ? Math.max(h.count, h.goal) : h.count;
    const dhikrId = `c-${h.counterId}`;
    daily = addDaily(daily, dayKey(h.completedAt), dhikrId, count);
    return {
      id: `v1-${h.id}`,
      dhikrId,
      name: h.counterName,
      count,
      target: h.goal,
      startedAt: h.completedAt,
      endedAt: h.completedAt,
      completed: h.goal != null,
    };
  });

  const settings: AppSettings = { ...s.settings };
  if (old) {
    if (old.vibrationEnabled !== undefined) settings.vibration = old.vibrationEnabled;
    if (old.soundEnabled !== undefined) settings.sound = old.soundEnabled;
    if (old.soundVolume !== undefined) settings.volume = old.soundVolume;
    if (old.autoResetAfterGoal !== undefined) settings.autoReset = old.autoResetAfterGoal;
    settings.theme = old.darkMode === true ? 'dark' : old.darkMode === false ? 'light' : 'system';
  }

  const hadData = counters.length > 0 || history.length > 0 || old !== null || Object.keys(dhikrCounts).length > 0;
  return {
    ...s,
    onboarded: hadData,
    customDhikr,
    progress,
    activeId: customDhikr[0]?.id || s.activeId,
    sessions,
    daily,
    settings,
  };
};

// ---------- Statistics ----------

export const dayTotal = (s: AppState, key: string): number =>
  Object.values(s.daily[key] || {}).reduce((a, b) => a + b, 0);

/** Totals for the last `days` days ending today, oldest first. */
export const dailySeries = (s: AppState, now: number, days: number) =>
  Array.from({ length: days }, (_, i) => {
    const ts = now - (days - 1 - i) * DAY_MS;
    const key = dayKey(ts);
    return { key, ts, total: dayTotal(s, key) };
  });

/** Totals per calendar month for the last 12 months, oldest first. */
export const monthlySeries = (s: AppState, now: number) => {
  const d = new Date(now);
  return Array.from({ length: 12 }, (_, i) => {
    const m = new Date(d.getFullYear(), d.getMonth() - 11 + i, 1);
    const prefix = `${m.getFullYear()}-${`${m.getMonth() + 1}`.padStart(2, '0')}`;
    const total = Object.keys(s.daily)
      .filter((k) => k.startsWith(prefix))
      .reduce((sum, k) => sum + dayTotal(s, k), 0);
    return { key: prefix, ts: m.getTime(), total };
  });
};

export const computeStats = (s: AppState, now: number) => {
  const goal = Math.max(1, s.settings.dailyGoal);
  const today = dayTotal(s, dayKey(now));
  const last30 = dailySeries(s, now, 30);
  const week = last30.slice(-7).reduce((a, d) => a + d.total, 0);
  const month = last30.reduce((a, d) => a + d.total, 0);
  const lifetime = Object.keys(s.daily).reduce((a, k) => a + dayTotal(s, k), 0);

  // Streak: consecutive days meeting the daily goal; today still counts as open until it ends.
  let streak = 0;
  let ts = today >= goal ? now : now - DAY_MS;
  while (dayTotal(s, dayKey(ts)) >= goal) {
    streak++;
    ts -= DAY_MS;
  }

  const goalDays = Object.keys(s.daily).filter((k) => dayTotal(s, k) >= goal).length;
  const activeDays30 = last30.filter((d) => d.total > 0).length;

  const perDhikr: Record<string, number> = {};
  Object.values(s.daily).forEach((day) =>
    Object.entries(day).forEach(([id, n]) => {
      perDhikr[id] = (perDhikr[id] || 0) + n;
    })
  );
  const nameOf = (id: string) =>
    findDhikr(s, id)?.transliteration || s.sessions.find((x) => x.dhikrId === id)?.name || 'Removed dhikr';
  const mostRecited = Object.entries(perDhikr)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, total]) => ({ id, name: nameOf(id), total }));

  return {
    today,
    week,
    month,
    lifetime,
    streak,
    goalDays,
    targetsCompleted: s.sessions.filter((x) => x.completed).length,
    consistency: Math.round((activeDays30 / 30) * 100),
    goalProgress: Math.min(1, today / goal),
    mostRecited,
  };
};

export type Stats = ReturnType<typeof computeStats>;
