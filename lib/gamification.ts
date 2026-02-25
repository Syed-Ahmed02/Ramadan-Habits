import { XP_PER_LEVEL, MAX_LEVEL, STREAK_MILESTONES, STREAK_BONUS_XP } from "./constants";

/**
 * Calculate the user's level based on total XP.
 * Level N requires N * 100 total XP.
 * Uses the quadratic formula to solve: totalXP = sum(1..N) * 100 = N*(N+1)/2 * 100
 */
export function calculateLevel(totalXp: number): number {
  if (totalXp <= 0) return 1;
  // Solve N*(N+1)/2 * XP_PER_LEVEL <= totalXp
  // N^2 + N - 2*totalXp/XP_PER_LEVEL <= 0
  const discriminant = 1 + (8 * totalXp) / XP_PER_LEVEL;
  const level = Math.floor((-1 + Math.sqrt(discriminant)) / 2);
  return Math.min(Math.max(level, 1), MAX_LEVEL);
}

/**
 * Get the total XP required to reach a specific level.
 */
export function xpForLevel(level: number): number {
  return (level * (level + 1) / 2) * XP_PER_LEVEL;
}

/**
 * Get XP progress within the current level.
 * Returns { current, required, percentage }
 */
export function getLevelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  percentage: number;
} {
  const level = calculateLevel(totalXp);
  const currentLevelThreshold = xpForLevel(level);
  const nextLevelThreshold = xpForLevel(level + 1);
  const xpInLevel = totalXp - currentLevelThreshold;
  const xpNeeded = nextLevelThreshold - currentLevelThreshold;

  return {
    level,
    currentLevelXp: xpInLevel,
    nextLevelXp: xpNeeded,
    percentage: Math.min((xpInLevel / xpNeeded) * 100, 100),
  };
}

/**
 * Check if a streak milestone has been reached.
 */
export function checkStreakMilestone(streak: number): number | null {
  const milestone = STREAK_MILESTONES.find((m) => m === streak);
  return milestone ?? null;
}

/**
 * Get bonus XP for a streak milestone.
 */
export function getStreakBonusXp(streak: number): number {
  return STREAK_BONUS_XP[streak] ?? 0;
}

/**
 * Get today's date as an ISO date string (YYYY-MM-DD) in local timezone.
 */
export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get yesterday's date as an ISO date string.
 */
export function getYesterdayDateString(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return now.toISOString().split("T")[0];
}

/**
 * Format XP number with commas.
 */
export function formatXp(xp: number): string {
  return xp.toLocaleString();
}

/**
 * Get the Ramadan day number (1-30) based on a start date.
 * Returns null if outside of Ramadan.
 */
export function getRamadanDay(startDate: string): number | null {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  if (diffDays < 1 || diffDays > 30) return null;
  return diffDays;
}

/**
 * Get the ISO date string for a given Ramadan day (1-30).
 */
export function getDateForRamadanDay(
  ramadanDay: number,
  startDate: string
): string {
  const start = new Date(startDate + "T12:00:00");
  start.setDate(start.getDate() + ramadanDay - 1);
  return start.toISOString().split("T")[0];
}

/**
 * Get all 30 Ramadan day date strings.
 */
export function getRamadanDateRange(startDate: string): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    getDateForRamadanDay(i + 1, startDate)
  );
}

/**
 * Calculate completion percentage for a day.
 */
export function getDailyCompletionPercentage(
  completedCount: number,
  totalCount: number
): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}
