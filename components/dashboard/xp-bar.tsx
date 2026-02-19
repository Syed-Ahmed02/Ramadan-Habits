"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getLevelProgress, formatXp } from "@/lib/gamification";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { motion } from "motion/react";

export function XpBar() {
  const user = useQuery(api.users.getCurrentUser);

  if (!user) {
    return (
      <div className="h-20 rounded-xl bg-muted animate-pulse" />
    );
  }

  const { level, currentLevelXp, nextLevelXp, percentage } = getLevelProgress(
    user.xp
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Star className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold">Level {level}</p>
            <p className="text-xs text-muted-foreground">
              {formatXp(user.xp)} total XP
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {formatXp(currentLevelXp)} / {formatXp(nextLevelXp)} XP
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Progress value={percentage} className="h-2.5" />
        </motion.div>
        <p className="text-[11px] text-muted-foreground text-right">
          {Math.round(percentage)}% to Level {level + 1}
        </p>
      </div>
    </div>
  );
}
