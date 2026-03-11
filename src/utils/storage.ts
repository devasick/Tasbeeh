import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Counter, CountHistory, AppSettings } from '../types';

const KEYS = {
  COUNTERS: '@tasbeeh_counters',
  HISTORY: '@tasbeeh_history',
  SETTINGS: '@tasbeeh_settings',
  DHIKR_COUNTS: '@tasbeeh_dhikr_counts',
};

// Web-compatible storage wrapper
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('localStorage getItem error:', error);
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  },
  
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('localStorage setItem error:', error);
      }
      return;
    }
    return AsyncStorage.setItem(key, value);
  },
  
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('localStorage removeItem error:', error);
      }
      return;
    }
    return AsyncStorage.removeItem(key);
  },
};

// Counter operations
export const saveCounters = async (counters: Counter[]): Promise<void> => {
  try {
    await storage.setItem(KEYS.COUNTERS, JSON.stringify(counters));
  } catch (error) {
    console.error('Error saving counters:', error);
  }
};

export const loadCounters = async (): Promise<Counter[]> => {
  try {
    const data = await storage.getItem(KEYS.COUNTERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading counters:', error);
    return [];
  }
};

// History operations
export const saveHistory = async (history: CountHistory[]): Promise<void> => {
  try {
    await storage.setItem(KEYS.HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

export const loadHistory = async (): Promise<CountHistory[]> => {
  try {
    const data = await storage.getItem(KEYS.HISTORY);
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
    await storage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const loadSettings = async (): Promise<AppSettings | null> => {
  try {
    const data = await storage.getItem(KEYS.SETTINGS);
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

// Dhikr count operations
export const saveDhikrCount = async (dhikrId: string, count: number): Promise<void> => {
  try {
    const data = await storage.getItem(KEYS.DHIKR_COUNTS);
    const counts = data ? JSON.parse(data) : {};
    counts[dhikrId] = count;
    await storage.setItem(KEYS.DHIKR_COUNTS, JSON.stringify(counts));
  } catch (error) {
    console.error('Error saving dhikr count:', error);
  }
};

export const loadDhikrCount = async (dhikrId: string): Promise<number> => {
  try {
    const data = await storage.getItem(KEYS.DHIKR_COUNTS);
    const counts = data ? JSON.parse(data) : {};
    return counts[dhikrId] || 0;
  } catch (error) {
    console.error('Error loading dhikr count:', error);
    return 0;
  }
};
