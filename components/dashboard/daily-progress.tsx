"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTodayDateString, getDailyCompletionPercentage } from "@/lib/gamification";
import { Target, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";

export function DailyProgress() {
  const today = getTodayDateString();
  const stats = useQuery(api.habitLogs.getTodayStats, { date: today });

  if (!stats) {
    return (
      <div className="h-24 rounded-xl bg-muted animate-pulse" />
    );
  }

  const percentage = getDailyCompletionPercentage(stats.completed, stats.total);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Today&apos;s Progress</h3>
        <span className="text-xs text-muted-foreground">{today}</span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <p className="text-lg font-bold tabular-nums">{stats.completed}</p>
          <p className="text-[10px] text-muted-foreground">Completed</p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Target className="h-4 w-4 text-blue-500" />
          <p className="text-lg font-bold tabular-nums">{percentage}%</p>
          <p className="text-[10px] text-muted-foreground">Complete</p>
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <p className="text-lg font-bold tabular-nums">{stats.xpEarned}</p>
          <p className="text-[10px] text-muted-foreground">XP Today</p>
        </motion.div>
      </div>
    </div>
  );
}
