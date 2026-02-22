"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTodayDateString, getDailyCompletionPercentage } from "@/lib/gamification";
import { Target, CheckCircle2, Zap } from "lucide-react";
import { motion, animate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

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
        <AnimatedStatCard
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
          value={stats.completed}
          label="Completed"
          delay={0.1}
        />
        <AnimatedStatCard
          icon={<Target className="h-4 w-4 text-blue-500" />}
          value={percentage}
          label="Complete"
          suffix="%"
          delay={0.2}
        />
        <AnimatedStatCard
          icon={<Zap className="h-4 w-4 text-amber-500" />}
          value={stats.xpEarned}
          label="XP Today"
          delay={0.3}
        />
      </div>
    </div>
  );
}

function AnimatedStatCard({
  icon,
  value,
  label,
  suffix = "",
  delay,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v));
  const displayRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.8,
      ease: "easeOut" as const,
      delay,
    });

    // Update the DOM directly for performance
    const unsubscribe = rounded.on("change", (v) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${v}${suffix}`;
      }
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value, delay, motionValue, rounded, suffix]);

  return (
    <motion.div
      className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-2.5"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.3 }}
    >
      {icon}
      <p ref={displayRef} className="text-lg font-bold tabular-nums">
        {value}{suffix}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </motion.div>
  );
}
