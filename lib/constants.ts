// XP and Level System
export const XP_PER_LEVEL = 100; // Level N requires N * 100 total XP
export const MAX_LEVEL = 30;

// Streak milestones that trigger special rewards
export const STREAK_MILESTONES = [3, 7, 10, 14, 21, 30] as const;

// Bonus XP for streak milestones
export const STREAK_BONUS_XP: Record<number, number> = {
  3: 50,
  7: 100,
  10: 150,
  14: 200,
  21: 300,
  30: 500,
};

// Habit categories
export const HABIT_CATEGORIES = [
  "prayer",
  "quran",
  "dhikr",
  "charity",
  "character",
  "fasting",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

// Category display info
export const CATEGORY_INFO: Record<
  HabitCategory,
  { label: string; icon: string; color: string; bgColor: string }
> = {
  prayer: {
    label: "Prayer",
    icon: "Moon",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  quran: {
    label: "Quran",
    icon: "BookOpen",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  dhikr: {
    label: "Dhikr",
    icon: "Heart",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  charity: {
    label: "Charity",
    icon: "HandHeart",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  character: {
    label: "Character",
    icon: "Sparkles",
    color: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-900/30",
  },
  fasting: {
    label: "Fasting",
    icon: "Utensils",
    color: "text-teal-600 dark:text-teal-400",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
  },
};

// Badge definitions
export const BADGE_DEFINITIONS = {
  first_step: {
    name: "First Step",
    description: "Complete your first habit",
    icon: "Footprints",
  },
  consistent: {
    name: "Consistent",
    description: "Achieve a 7-day streak",
    icon: "Flame",
  },
  halfway_there: {
    name: "Halfway There",
    description: "Achieve a 15-day streak",
    icon: "Target",
  },
  ramadan_champion: {
    name: "Ramadan Champion",
    description: "Complete the full 30-day streak",
    icon: "Trophy",
  },
  quran_khatm: {
    name: "Quran Khatm",
    description: "Complete 30 Juz readings",
    icon: "BookOpen",
  },
  charity_champion: {
    name: "Charity Champion",
    description: "30 days of sadaqah",
    icon: "HandHeart",
  },
  night_owl: {
    name: "Night Owl",
    description: "Complete 10 Tahajjud prayers",
    icon: "Moon",
  },
  social_butterfly: {
    name: "Social Butterfly",
    description: "Add 5 friends",
    icon: "Users",
  },
  challenge_master: {
    name: "Challenge Master",
    description: "Complete 3 group challenges",
    icon: "Swords",
  },
} as const;

export type BadgeType = keyof typeof BADGE_DEFINITIONS;

// Default habits seed data
export const DEFAULT_HABITS = [
  // Prayer (xp: 15-25)
  { title: "Fajr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 1 },
  { title: "Dhuhr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 2 },
  { title: "Asr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 3 },
  { title: "Maghrib Prayer", category: "prayer", xpReward: 20, icon: "Sunset", order: 4 },
  { title: "Isha Prayer", category: "prayer", xpReward: 20, icon: "Moon", order: 5 },
  { title: "Taraweeh Prayer", category: "prayer", xpReward: 25, icon: "Star", order: 6 },
  { title: "Tahajjud / Qiyam al-Layl", category: "prayer", xpReward: 25, icon: "Moon", order: 7 },
  { title: "Duha Prayer", category: "prayer", xpReward: 15, icon: "Sunrise", order: 8 },

  // Quran (xp: 20-30)
  { title: "Read 1 Juz", category: "quran", xpReward: 30, icon: "BookOpen", order: 9 },
  { title: "Memorize an Ayah", category: "quran", xpReward: 25, icon: "Brain", order: 10 },
  { title: "Listen to Tafsir", category: "quran", xpReward: 20, icon: "Headphones", order: 11 },
  { title: "Recite with Tajweed", category: "quran", xpReward: 20, icon: "BookOpenCheck", order: 12 },

  // Dhikr (xp: 10-15)
  { title: "Morning Adhkar", category: "dhikr", xpReward: 15, icon: "Sunrise", order: 13 },
  { title: "Evening Adhkar", category: "dhikr", xpReward: 15, icon: "Sunset", order: 14 },
  { title: "100x SubhanAllah", category: "dhikr", xpReward: 10, icon: "Heart", order: 15 },
  { title: "100x Alhamdulillah", category: "dhikr", xpReward: 10, icon: "Heart", order: 16 },
  { title: "100x Istighfar", category: "dhikr", xpReward: 10, icon: "Heart", order: 17 },
  { title: "Send Salawat on the Prophet", category: "dhikr", xpReward: 10, icon: "Heart", order: 18 },

  // Charity (xp: 20-25)
  { title: "Give Daily Sadaqah", category: "charity", xpReward: 25, icon: "HandHeart", order: 19 },
  { title: "Feed Someone Iftar", category: "charity", xpReward: 25, icon: "Utensils", order: 20 },
  { title: "Donate to a Cause", category: "charity", xpReward: 20, icon: "CircleDollarSign", order: 21 },
  { title: "Help a Neighbor", category: "charity", xpReward: 20, icon: "Users", order: 22 },

  // Character (xp: 15-20)
  { title: "No Backbiting", category: "character", xpReward: 20, icon: "ShieldCheck", order: 23 },
  { title: "Smile at Others", category: "character", xpReward: 15, icon: "Smile", order: 24 },
  { title: "Help Someone in Need", category: "character", xpReward: 20, icon: "HandHelping", order: 25 },
  { title: "Practice Patience", category: "character", xpReward: 15, icon: "Timer", order: 26 },
  { title: "Make Dua for Others", category: "character", xpReward: 15, icon: "Sparkles", order: 27 },

  // Fasting (xp: 20-25)
  { title: "Fast the Day", category: "fasting", xpReward: 25, icon: "Moon", order: 28 },
  { title: "Eat Suhoor", category: "fasting", xpReward: 20, icon: "Coffee", order: 29 },
  { title: "Break Fast on Time", category: "fasting", xpReward: 20, icon: "Clock", order: 30 },
] as const;
