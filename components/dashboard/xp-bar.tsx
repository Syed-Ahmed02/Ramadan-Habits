"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getLevelProgress, formatXp } from "@/lib/gamification";
import { Star } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";

interface XpBarProps {
  /** Previous XP value for animating the transition */
  previousXp?: number;
  /** Called when a level-up is detected */
  onLevelUp?: (newLevel: number) => void;
}

export function XpBar({ previousXp, onLevelUp }: XpBarProps) {
  const user = useQuery(api.users.getCurrentUser);
  const prevLevelRef = useRef<number | null>(null);

  const progress = user ? getLevelProgress(user.xp) : null;

  // Detect level-up — must be called on every render (before any early return)
  useEffect(() => {
    if (!progress) return;
    if (prevLevelRef.current !== null && progress.level > prevLevelRef.current) {
      onLevelUp?.(progress.level);
    }
    prevLevelRef.current = progress.level;
  }, [progress?.level, onLevelUp, progress]);

  if (!user || !progress) {
    return (
      <div className="h-20 rounded-xl bg-muted animate-pulse" />
    );
  }

  const { level, currentLevelXp, nextLevelXp, percentage } = progress;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Star className="h-4 w-4 text-primary" />
          </motion.div>
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
        <AnimatedProgressBar percentage={percentage} />
        <p className="text-[11px] text-muted-foreground text-right">
          {Math.round(percentage)}% to Level {level + 1}
        </p>
      </div>
    </div>
  );
}

function AnimatedProgressBar({ percentage }: { percentage: number }) {
  const progressValue = useMotionValue(0);
  const width = useTransform(progressValue, (v) => `${v}%`);
  const glowOpacity = useTransform(progressValue, [0, 100], [0, 0.6]);

  useEffect(() => {
    const controls = animate(progressValue, percentage, {
      duration: 0.8,
      ease: "easeOut" as const,
    });
    return () => controls.stop();
  }, [percentage, progressValue]);

  return (
    <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
      {/* Animated fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-primary"
        style={{ width }}
      />

      {/* Glow effect at the leading edge */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width,
          boxShadow: "0 0 8px 2px oklch(0.85 0.17 160 / 0.5)",
          opacity: glowOpacity,
        }}
      />

      {/* Shimmer overlay */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "linear",
        }}
      />
    </div>
  );
}
