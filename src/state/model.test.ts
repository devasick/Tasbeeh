import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reducer, initialState, migrateV1, computeStats, dayKey, getProgress, IDLE_SESSION_MS } from './model';
import { qiblaBearing, prayerTimesFor } from '../utils/prayerMath';

const T0 = new Date(2026, 10, 16, 9, 0, 0).getTime();
const DAY = 24 * 3600 * 1000;

const tap = (s = initialState(), n: number, now = T0) => {
  for (let i = 0; i < n; i++) s = reducer(s, { type: 'increment', now: now + i });
  return s;
};

test('rapid taps are all counted and reaching the target logs a completed session', () => {
  const s = tap(initialState(), 33); // dhikr-1 target is 33
  assert.equal(getProgress(s, 'dhikr-1').count, 33);
  assert.equal(s.sessions.length, 1);
  assert.equal(s.sessions[0].count, 33);
  assert.equal(s.sessions[0].completed, true);
  assert.equal(s.session, null);
  assert.ok(s.celebrateAt > 0);
  assert.equal(computeStats(s, T0).today, 33);
});

test('undo removes one count from progress and today', () => {
  let s = tap(initialState(), 5);
  s = reducer(s, { type: 'undo', now: T0 + 10 });
  assert.equal(getProgress(s, 'dhikr-1').count, 4);
  assert.equal(computeStats(s, T0).today, 4);
  // undo never goes below zero
  s = reducer(reducer(initialState(), { type: 'undo', now: T0 }), { type: 'undo', now: T0 });
  assert.equal(getProgress(s, 'dhikr-1').count, 0);
});

test('reset logs the session, keeps stats and zeroes the counter', () => {
  let s = tap(initialState(), 10);
  s = reducer(s, { type: 'reset', now: T0 + 100 });
  assert.equal(getProgress(s, 'dhikr-1').count, 0);
  assert.equal(s.sessions[0].count, 10);
  assert.equal(s.sessions[0].completed, false);
  assert.equal(computeStats(s, T0).lifetime, 10);
});

test('switching dhikr or idling ends the running session', () => {
  let s = tap(initialState(), 3);
  s = reducer(s, { type: 'select', id: 'dhikr-2', now: T0 + 50 });
  assert.equal(s.sessions.length, 1);
  s = tap(s, 2, T0 + 60);
  s = tap(s, 1, T0 + 60 + IDLE_SESSION_MS + 1000);
  assert.equal(s.sessions.length, 2);
  assert.equal(s.session?.count, 1);
});

test('deleting a session removes its counts from statistics', () => {
  let s = tap(initialState(), 10);
  s = reducer(s, { type: 'reset', now: T0 + 100 });
  s = reducer(s, { type: 'deleteSession', id: s.sessions[0].id });
  assert.equal(s.sessions.length, 0);
  assert.equal(computeStats(s, T0).lifetime, 0);
});

test('deleting the active custom dhikr falls back to a preset', () => {
  let s = reducer(initialState(), {
    type: 'saveDhikr',
    dhikr: { id: 'c-1', arabicText: '', transliteration: 'Mine', meaning: '', recommendedCount: 10, hadithReference: '', hadithSource: '', custom: true },
  });
  s = reducer(s, { type: 'select', id: 'c-1', now: T0 });
  s = reducer(s, { type: 'deleteDhikr', id: 'c-1', now: T0 });
  assert.equal(s.customDhikr.length, 0);
  assert.equal(s.activeId, 'dhikr-1');
});

test('streak counts consecutive days meeting the daily goal', () => {
  let s = reducer(initialState(), { type: 'updateSettings', settings: { dailyGoal: 5 } });
  s = reducer(s, { type: 'setTarget', id: 'dhikr-1', target: null });
  for (let d = 3; d >= 1; d--) s = tap(s, 5, T0 - d * DAY);
  assert.equal(computeStats(s, T0).streak, 3); // today not met yet, streak still alive
  s = tap(s, 5, T0);
  assert.equal(computeStats(s, T0).streak, 4);
});

test('v1 data migrates counters, dhikr counts, history and settings', () => {
  const when = T0 - DAY;
  const s = migrateV1({
    counters: JSON.stringify([{ id: '1', name: 'Morning', currentCount: 12, goal: 100 }]),
    history: JSON.stringify([{ id: 'h', counterId: '1', counterName: 'Morning', count: 32, goal: 33, completedAt: when }]),
    settings: JSON.stringify({ vibrationEnabled: false, soundEnabled: true, soundVolume: 1, darkMode: true, autoResetAfterGoal: true }),
    dhikrCounts: JSON.stringify({ 'dhikr-4': 40 }),
  });
  assert.equal(s.onboarded, true);
  assert.equal(s.customDhikr[0].transliteration, 'Morning');
  assert.equal(s.activeId, 'c-1');
  assert.deepEqual(getProgress(s, 'c-1'), { count: 12, target: 100 });
  assert.equal(getProgress(s, 'dhikr-4').count, 40);
  assert.equal(s.sessions[0].count, 33); // v1 off-by-one corrected
  assert.equal(s.daily[dayKey(when)]['c-1'], 33);
  assert.equal(s.settings.theme, 'dark');
  assert.equal(s.settings.vibration, false);
  assert.equal(s.settings.autoReset, true);
});

test('empty or corrupt v1 data gives a fresh state', () => {
  const s = migrateV1({ counters: '{bad', history: null, settings: null, dhikrCounts: null });
  assert.equal(s.onboarded, false);
  assert.equal(s.customDhikr.length, 0);
});

test('qibla bearing from London is about 119 degrees', () => {
  const b = qiblaBearing({ lat: 51.5074, lng: -0.1278 });
  assert.ok(Math.abs(b - 119) < 1, String(b));
});

test('prayer times come out in order', () => {
  const times = prayerTimesFor(new Date(2026, 5, 1), { lat: 21.4225, lng: 39.8262 }, 'UmmAlQura', 'shafi');
  const order = times.map((t) => t.time.getTime());
  assert.deepEqual([...order].sort((a, b) => a - b), order);
  assert.deepEqual(times.map((t) => t.key), ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha']);
});
