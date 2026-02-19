"use client";

import { DailyChecklist } from "@/components/dashboard/daily-checklist";
import { XpBar } from "@/components/dashboard/xp-bar";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { DailyProgress } from "@/components/dashboard/daily-progress";
import { motion } from "motion/react";

export default function DashboardPage() {
  return (
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

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <XpBar />
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
          <DailyChecklist />
        </div>
      </motion.div>
    </div>
  );
}
