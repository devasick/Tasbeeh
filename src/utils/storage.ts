import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../types';
import { migrateV1, normalize, initialState } from '../state/model';

const STATE_KEY = '@tasbeeh_state_v2';
// v1 keys are read once for migration and left in place as a backup.
const V1_KEYS = {
  counters: '@tasbeeh_counters',
  history: '@tasbeeh_history',
  settings: '@tasbeeh_settings',
  dhikrCounts: '@tasbeeh_dhikr_counts',
};

export const loadState = async (): Promise<AppState> => {
  try {
    const raw = await AsyncStorage.getItem(STATE_KEY);
    if (raw) {
      try {
        return normalize(JSON.parse(raw));
      } catch (error) {
        // Keep the unreadable copy so a fresh state never silently overwrites it.
        await AsyncStorage.setItem(`${STATE_KEY}_corrupt_${Date.now()}`, raw);
        throw error;
      }
    }
    const [counters, history, settings, dhikrCounts] = await Promise.all([
      AsyncStorage.getItem(V1_KEYS.counters),
      AsyncStorage.getItem(V1_KEYS.history),
      AsyncStorage.getItem(V1_KEYS.settings),
      AsyncStorage.getItem(V1_KEYS.dhikrCounts),
    ]);
    const migrated = migrateV1({ counters, history, settings, dhikrCounts });
    await saveState(migrated);
    return migrated;
  } catch (error) {
    console.error('Error loading state:', error);
    return initialState();
  }
};

export const saveState = async (state: AppState): Promise<void> => {
  try {
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving state:', error);
  }
};
