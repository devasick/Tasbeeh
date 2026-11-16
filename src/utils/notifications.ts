import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Language, PrayerSettings, Reminder } from '../types';
import { NOTIFY_KEYS, prayerTimesFor } from './prayerMath';
import { translate } from '../i18n';

const DAYS_AHEAD = 3; // one-off alarms, topped up every time the app opens
const supported = Platform.OS !== 'web';

if (supported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

let channelsReady = false;
const ensureChannels = async () => {
  if (channelsReady || Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('reminders', {
    name: 'Dhikr reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  await Notifications.setNotificationChannelAsync('prayers', {
    name: 'Prayer times',
    importance: Notifications.AndroidImportance.HIGH,
  });
  channelsReady = true;
};

/** Asks only when needed; returns whether notifications may be shown. */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!supported) return false;
  try {
    await ensureChannels();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    return (await Notifications.requestPermissionsAsync()).granted;
  } catch (error) {
    console.warn('Notification permission failed:', error);
    return false;
  }
};

const cancelKind = async (kind: 'reminder' | 'prayer') => {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => n.content.data?.kind === kind)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
};

const granted = async () => supported && (await Notifications.getPermissionsAsync()).granted;

export const syncReminders = async (reminders: Reminder[]) => {
  if (!supported) return;
  try {
    await cancelKind('reminder');
    const active = reminders.filter((r) => r.enabled && r.days.length > 0);
    if (active.length === 0 || !(await granted())) return;
    await ensureChannels();
    for (const r of active) {
      const content = { title: 'Tasbeeh', body: r.message, data: { kind: 'reminder', id: r.id } };
      if (r.days.length === 7) {
        await Notifications.scheduleNotificationAsync({
          content,
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: r.hour, minute: r.minute, channelId: 'reminders' },
        });
      } else {
        for (const day of r.days) {
          await Notifications.scheduleNotificationAsync({
            content,
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: day + 1, // expo: 1 = Sunday
              hour: r.hour,
              minute: r.minute,
              channelId: 'reminders',
            },
          });
        }
      }
    }
  } catch (error) {
    console.warn('Scheduling reminders failed:', error);
  }
};

export const syncPrayerNotifications = async (prayer: PrayerSettings, lang: Language) => {
  if (!supported) return;
  try {
    await cancelKind('prayer');
    const loc = prayer.location;
    if (!prayer.notify || !loc || !(await granted())) return;
    await ensureChannels();
    const now = Date.now();
    const today = new Date();
    for (let d = 0; d < DAYS_AHEAD; d++) {
      const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() + d);
      for (const p of prayerTimesFor(day, loc, prayer.method, prayer.madhab)) {
        if (!NOTIFY_KEYS.includes(p.key)) continue;
        const at = p.time.getTime() - prayer.notifyBefore * 60000;
        if (at <= now) continue;
        const name = translate(lang, p.key);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: translate(lang, 'prayerSoonTitle', { name }),
            body: translate(lang, 'prayerSoonBody', { name, minutes: prayer.notifyBefore }),
            data: { kind: 'prayer' },
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: 'prayers' },
        });
      }
    }
  } catch (error) {
    console.warn('Scheduling prayer alerts failed:', error);
  }
};
