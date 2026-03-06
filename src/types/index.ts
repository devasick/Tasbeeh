// Core types for the Tasbeeh Counter app

export interface Counter {
  id: string;
  name: string;
  currentCount: number;
  goal: number | null;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export interface CountHistory {
  id: string;
  counterId: string;
  counterName: string;
  count: number;
  goal: number | null;
  completedAt: number;
}

export interface AppSettings {
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  darkMode: boolean | 'auto';
  autoResetAfterGoal: boolean;
  defaultGoal: number | null;
}

export interface Statistics {
  totalCounts: number;
  todayCounts: number;
  weekCounts: number;
  monthCounts: number;
  goalsCompleted: number;
  mostUsedCounter: string | null;
  currentStreak: number;
}

export interface Dhikr {
  id: string;
  arabicText: string;
  transliteration: string;
  meaning: string;
  recommendedCount: number;
  hadithReference: string;
  hadithSource: string;
}

export const PRESET_GOALS = [33, 99, 100, 500, 1000];

export const DEFAULT_COLORS = [
  '#2ECC71', // Green
  '#3498DB', // Blue
  '#9B59B6', // Purple
  '#E74C3C', // Red
  '#F39C12', // Orange
  '#1ABC9C', // Teal
  '#34495E', // Dark Blue-Grey
  '#E67E22', // Carrot
];
