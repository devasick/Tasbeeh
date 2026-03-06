import AsyncStorage from '@react-native-async-storage/async-storage';
import { Counter, CountHistory, AppSettings } from '../types';

const KEYS = {
  COUNTERS: '@tasbeeh_counters',
  HISTORY: '@tasbeeh_history',
  SETTINGS: '@tasbeeh_settings',
};

// Counter operations
export const saveCounters = async (counters: Counter[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.COUNTERS, JSON.stringify(counters));
  } catch (error) {
    console.error('Error saving counters:', error);
  }
};

export const loadCounters = async (): Promise<Counter[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.COUNTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading counters:', error);
    return [];
  }
};

// History operations
export const saveHistory = async (history: CountHistory[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const loadHistory = async (): Promise<CountHistory[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const addHistoryEntry = async (entry: CountHistory): Promise<void> => {
  try {
    const history = await loadHistory();
    history.unshift(entry); // Add to beginning
    // Keep only last 100 entries
    if (history.length > 100) {
      history.splice(100);
    }
    await saveHistory(history);
  } catch (error) {
    console.error('Error adding history entry:', error);
  }
};

// Settings operations
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<AppSettings | null> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  vibrationEnabled: true,
  soundEnabled: true,
  soundVolume: 0.5,
  darkMode: 'auto',
  autoResetAfterGoal: false,
  defaultGoal: null,
};
