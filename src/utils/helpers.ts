import { Statistics, CountHistory, Counter } from '../types';

export const calculateStatistics = (
  counters: Counter[],
  history: CountHistory[]
): Statistics => {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

  // Calculate total counts from current counters
  const totalCounts = counters.reduce((sum, counter) => sum + counter.currentCount, 0);

  // Calculate counts from history
  const todayHistory = history.filter(h => h.completedAt >= oneDayAgo);
  const weekHistory = history.filter(h => h.completedAt >= oneWeekAgo);
  const monthHistory = history.filter(h => h.completedAt >= oneMonthAgo);

  const todayCounts = todayHistory.reduce((sum, h) => sum + h.count, 0);
  const weekCounts = weekHistory.reduce((sum, h) => sum + h.count, 0);
  const monthCounts = monthHistory.reduce((sum, h) => sum + h.count, 0);

  // Goals completed
  const goalsCompleted = history.filter(h => h.goal !== null && h.count >= h.goal).length;

  // Most used counter
  const counterUsage = new Map<string, number>();
  history.forEach(h => {
    counterUsage.set(h.counterId, (counterUsage.get(h.counterId) || 0) + 1);
  });
  
  let mostUsedCounter: string | null = null;
  let maxUsage = 0;
  counterUsage.forEach((usage, counterId) => {
    if (usage > maxUsage) {
      maxUsage = usage;
      const counter = counters.find(c => c.id === counterId);
      mostUsedCounter = counter ? counter.name : null;
    }
  });

  // Calculate streak (consecutive days with activity)
  const currentStreak = calculateStreak(history);

  return {
    totalCounts,
    todayCounts,
    weekCounts,
    monthCounts,
    goalsCompleted,
    mostUsedCounter,
    currentStreak,
  };
};

const calculateStreak = (history: CountHistory[]): number => {
  if (history.length === 0) return 0;

  const days = new Set<string>();
  history.forEach(h => {
    const date = new Date(h.completedAt);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    days.add(dayKey);
  });

  const sortedDays = Array.from(days).sort().reverse();
  let streak = 0;
  const today = new Date();
  let checkDate = new Date(today);

  for (let i = 0; i < sortedDays.length; i++) {
    const dayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (sortedDays.includes(dayKey)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) {
    return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (date >= yesterday) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }
};
