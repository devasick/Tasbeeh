import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Counter, CountHistory, AppSettings, Statistics } from '../types';
import {
  saveCounters,
  loadCounters,
  loadHistory,
  addHistoryEntry,
  saveSettings,
  loadSettings,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import { calculateStatistics } from '../utils/helpers';
import { playClickSound, playGoalSound, triggerHaptic, triggerSuccessHaptic } from '../utils/feedback';

interface AppContextType {
  counters: Counter[];
  currentCounter: Counter | null;
  history: CountHistory[];
  settings: AppSettings;
  statistics: Statistics;
  setCurrentCounter: (counter: Counter | null) => void;
  addCounter: (counter: Counter) => void;
  updateCounter: (counter: Counter) => void;
  deleteCounter: (id: string) => void;
  incrementCounter: () => void;
  resetCounter: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  completeGoal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [currentCounter, setCurrentCounter] = useState<Counter | null>(null);
  const [history, setHistory] = useState<CountHistory[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [statistics, setStatistics] = useState<Statistics>({
    totalCounts: 0,
    todayCounts: 0,
    weekCounts: 0,
    monthCounts: 0,
    goalsCompleted: 0,
    mostUsedCounter: null,
    currentStreak: 0,
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading app data...');
      const [loadedCounters, loadedHistory, loadedSettings] = await Promise.all([
        loadCounters(),
        loadHistory(),
        loadSettings(),
      ]);

      console.log('Loaded counters:', loadedCounters);
      console.log('Loaded history:', loadedHistory);
      
      setCounters(loadedCounters);
      setHistory(loadedHistory);
      setSettings(loadedSettings || DEFAULT_SETTINGS);

      // Set first counter as current if none selected
      if (loadedCounters.length > 0 && !currentCounter) {
        setCurrentCounter(loadedCounters[0]);
      }
    };

    loadData();
  }, []);

  // Calculate statistics whenever counters or history change
  useEffect(() => {
    setStatistics(calculateStatistics(counters, history));
  }, [counters, history]);

  // Save counters whenever they change
  useEffect(() => {
    if (counters.length > 0) {
      console.log('Saving counters:', counters);
      saveCounters(counters);
    }
  }, [counters]);

  const addCounter = (counter: Counter) => {
    const newCounters = [...counters, counter];
    setCounters(newCounters);
    if (!currentCounter) {
      setCurrentCounter(counter);
    }
  };

  const updateCounter = (updatedCounter: Counter) => {
    const newCounters = counters.map((c) =>
      c.id === updatedCounter.id ? updatedCounter : c
    );
    setCounters(newCounters);
    if (currentCounter?.id === updatedCounter.id) {
      setCurrentCounter(updatedCounter);
    }
  };

  const deleteCounter = (id: string) => {
    const newCounters = counters.filter((c) => c.id !== id);
    setCounters(newCounters);
    if (currentCounter?.id === id) {
      setCurrentCounter(newCounters.length > 0 ? newCounters[0] : null);
    }
  };

  const incrementCounter = async () => {
    if (!currentCounter) return;

    // Provide feedback
    if (settings.vibrationEnabled) {
      await triggerHaptic('light');
    }
    if (settings.soundEnabled) {
      await playClickSound(settings.soundVolume);
    }

    const newCount = currentCounter.currentCount + 1;
    const updatedCounter = {
      ...currentCounter,
      currentCount: newCount,
      updatedAt: Date.now(),
    };

    // Check if goal is reached
    if (currentCounter.goal && newCount === currentCounter.goal) {
      completeGoal();
    }

    updateCounter(updatedCounter);
  };

  const resetCounter = () => {
    if (!currentCounter) return;

    const updatedCounter = {
      ...currentCounter,
      currentCount: 0,
      updatedAt: Date.now(),
    };

    updateCounter(updatedCounter);
  };

  const completeGoal = async () => {
    if (!currentCounter) return;

    // Enhanced feedback for goal completion
    if (settings.vibrationEnabled) {
      await triggerSuccessHaptic();
    }
    if (settings.soundEnabled) {
      await playGoalSound(settings.soundVolume);
    }

    // Add to history
    const historyEntry: CountHistory = {
      id: Date.now().toString(),
      counterId: currentCounter.id,
      counterName: currentCounter.name,
      count: currentCounter.currentCount,
      goal: currentCounter.goal,
      completedAt: Date.now(),
    };

    await addHistoryEntry(historyEntry);
    const updatedHistory = await loadHistory();
    setHistory(updatedHistory);

    // Auto-reset if enabled
    if (settings.autoResetAfterGoal) {
      setTimeout(() => resetCounter(), 1500); // Delay to show celebration
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
  };

  const value: AppContextType = {
    counters,
    currentCounter,
    history,
    settings,
    statistics,
    setCurrentCounter,
    addCounter,
    updateCounter,
    deleteCounter,
    incrementCounter,
    resetCounter,
    updateSettings,
    completeGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
