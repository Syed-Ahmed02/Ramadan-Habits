"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

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

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-xl",
              isOnFire
                ? "bg-orange-100 dark:bg-orange-900/30"
                : "bg-muted"
            )}
            animate={isOnFire ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Flame
              className={cn(
                "h-5 w-5",
                isOnFire
                  ? "text-orange-500"
                  : "text-muted-foreground"
              )}
            />
          </motion.div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{streak}</p>
            <p className="text-xs text-muted-foreground">
              {streak === 1 ? "day" : "days"} streak
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Best: {longestStreak}</span>
        </div>
      </div>
    </div>
  );
}
