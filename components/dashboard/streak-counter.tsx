"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { StreakFlame } from "@/components/animations/streak-flame";
import { STREAK_MILESTONES } from "@/lib/constants";

export function StreakCounter() {
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return (
      <div className="h-20 rounded-xl bg-muted animate-pulse" />
    );
  }

  const streak = user.streak;
  const longestStreak = user.longestStreak;
  const isOnFire = streak >= 3;

  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find((m) => m > streak);

  return (
    <div className={cn(
      "rounded-xl border bg-card p-4 transition-colors",
      isOnFire
        ? "border-orange-200 dark:border-orange-800/40"
        : "border-border"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated flame */}
          <div className="flex items-center justify-center w-10 h-10">
            {streak > 0 ? (
              <StreakFlame streak={streak} size="md" />
            ) : (
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2c0 0-6 6-6 12a6 6 0 0012 0c0-6-6-12-6-12z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <motion.p
              className="text-2xl font-bold tabular-nums"
              key={streak}
              initial={{ scale: 1.3, color: isOnFire ? "#f97316" : undefined }}
              animate={{ scale: 1, color: "inherit" }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            >
              {streak}
            </motion.p>
            <p className="text-xs text-muted-foreground">
              {streak === 1 ? "day" : "days"} streak
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Best: {longestStreak}</span>
          </div>
          {nextMilestone && (
            <p className="text-[10px] text-muted-foreground/70">
              Next milestone: {nextMilestone} days
            </p>
          )}
        </div>
      </div>

      {/* Streak milestone progress bar */}
      {nextMilestone && streak > 0 && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                isOnFire
                  ? "bg-gradient-to-r from-amber-400 to-orange-500"
                  : "bg-orange-300"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${(streak / nextMilestone) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
