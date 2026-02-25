"use client";

import dynamic from "next/dynamic";
import { DailyChecklist } from "@/components/dashboard/daily-checklist";
import { XpBar } from "@/components/dashboard/xp-bar";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { DailyProgress } from "@/components/dashboard/daily-progress";
import { MosqueBuilder } from "@/components/dashboard/mosque-builder";
import { motion } from "motion/react";

const ConfettiCelebration = dynamic(
  () => import("@/components/animations/confetti").then((m) => ({ default: m.ConfettiCelebration })),
  { ssr: false }
);
const LevelUpOverlay = dynamic(
  () => import("@/components/animations/level-up").then((m) => ({ default: m.LevelUpOverlay })),
  { ssr: false }
);
const BadgeEarned = dynamic(
  () => import("@/components/animations/badge-earned").then((m) => ({ default: m.BadgeEarned })),
  { ssr: false }
);
import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { type BadgeType } from "@/lib/constants";

export default function DashboardPage() {
  // Animation state
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [earnedBadge, setEarnedBadge] = useState<BadgeType | null>(null);

  // Track badges to detect new ones
  const badges = useQuery(api.badges.getUserBadges);
  const [knownBadgeCount, setKnownBadgeCount] = useState<number | null>(null);

  // Initialize known badge count
  if (badges && knownBadgeCount === null) {
    setKnownBadgeCount(badges.length);
  }

  // Detect new badge earned
  if (badges && knownBadgeCount !== null && badges.length > knownBadgeCount) {
    const newestBadge = badges[badges.length - 1];
    setEarnedBadge(newestBadge.badgeType as BadgeType);
    setKnownBadgeCount(badges.length);
  }

  // Handlers
  const handleAllCompleted = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleConfettiComplete = useCallback(() => {
    // Reset after confetti finishes
    setTimeout(() => setShowConfetti(false), 2000);
  }, []);

  const handleLevelUp = useCallback((newLevel: number) => {
    setLevelUpLevel(newLevel);
    // Also fire confetti on level up
    setShowConfetti(true);
  }, []);

  const handleDismissLevelUp = useCallback(() => {
    setLevelUpLevel(null);
  }, []);

  const handleDismissBadge = useCallback(() => {
    setEarnedBadge(null);
  }, []);

  const handleHabitToggle = useCallback((_completed: boolean, _xpChange: number) => {
    // XP popup is handled inside the checklist component
    // Could add additional effects here if needed
  }, []);

  return (
    <>
      {/* Celebration overlays */}
      <ConfettiCelebration
        trigger={showConfetti}
        onComplete={handleConfettiComplete}
      />
      <LevelUpOverlay
        show={levelUpLevel !== null}
        newLevel={levelUpLevel ?? 1}
        onDismiss={handleDismissLevelUp}
      />
      <BadgeEarned
        badgeType={earnedBadge}
        onDismiss={handleDismissBadge}
      />

      {/* Page content */}
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your daily good deeds and earn rewards
          </p>
        </motion.div>

        {/* Mosque Progress Visual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <MosqueBuilder />
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <XpBar onLevelUp={handleLevelUp} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <StreakCounter />
          </motion.div>
        </div>

        {/* Daily Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyProgress />
        </motion.div>

        {/* Daily Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Today&apos;s Habits</h2>
            <DailyChecklist
              onAllCompleted={handleAllCompleted}
              onHabitToggle={handleHabitToggle}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
}
