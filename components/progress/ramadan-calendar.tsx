"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { RAMADAN_START_DATE } from "@/lib/constants";
import {
  getRamadanDateRange,
  getDailyCompletionPercentage,
} from "@/lib/gamification";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check, Calendar } from "lucide-react";
import { useState } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { CATEGORY_INFO, type HabitCategory } from "@/lib/constants";

function getIcon(
  iconName: string | undefined
): React.ComponentType<LucideProps> | null {
  if (!iconName) return null;
  const icons = LucideIcons as unknown as Record<
    string,
    React.ComponentType<LucideProps>
  >;
  return icons[iconName] || null;
}

interface DayData {
  date: string;
  ramadanDay: number;
  completed: number;
  total: number;
  percentage: number;
  habitIds: Id<"habits">[];
}

export function RamadanCalendar() {
  const allLogs = useQuery(api.habitLogs.getAllLogs);
  const habits = useQuery(api.habits.getAllUserHabits);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const dateRange = getRamadanDateRange(RAMADAN_START_DATE);

  if (!allLogs || !habits) {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  const totalHabits = habits.length;
  const logByDate = new Map<string, typeof allLogs>();
  for (const log of allLogs) {
    if (!logByDate.has(log.date)) {
      logByDate.set(log.date, []);
    }
    logByDate.get(log.date)!.push(log);
  }

  const days: DayData[] = dateRange.map((date, i) => {
    const logs = logByDate.get(date) ?? [];
    const completedLogs = logs.filter((l) => l.completed);
    const completedCount = completedLogs.length;
    const percentage = getDailyCompletionPercentage(completedCount, totalHabits);
    const habitIds = completedLogs.map((l) => l.habitId);

    return {
      date,
      ramadanDay: i + 1,
      completed: completedCount,
      total: totalHabits,
      percentage,
      habitIds,
    };
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRamadanDay =
    dateRange.indexOf(todayStr) >= 0 ? dateRange.indexOf(todayStr) + 1 : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="h-4 w-4" />
        <span>Ramadan 2026 · Day 1–30</span>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {days.map((day) => {
          const isToday = todayRamadanDay === day.ramadanDay;
          const isSelected = selectedDay?.ramadanDay === day.ramadanDay;
          const isFuture =
            new Date(day.date) > new Date(todayStr);
          const isEmpty = day.total === 0;

          return (
            <motion.button
              key={day.date}
              onClick={() =>
                setSelectedDay((prev) =>
                  prev?.ramadanDay === day.ramadanDay ? null : day
                )
              }
              disabled={isEmpty}
              aria-label={`Ramadan Day ${day.ramadanDay}, ${day.percentage}% complete`}
              className={cn(
                "aspect-square min-w-[36px] min-h-[36px] rounded-lg flex flex-col items-center justify-center gap-0.5 text-xs transition-all touch-manipulation",
                "border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isSelected && "ring-2 ring-primary ring-offset-2",
                isToday && "border-primary shadow-md",
                !isToday && "border-border",
                day.percentage === 100 && "bg-primary/20 border-primary/50",
                day.percentage > 0 && day.percentage < 100 && "bg-primary/10",
                day.percentage === 0 && !isFuture && "bg-muted/50",
                isFuture && "bg-muted/30 opacity-60",
                isEmpty && "cursor-default"
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className={cn(
                  "font-medium",
                  isToday && "text-primary",
                  isFuture && "text-muted-foreground"
                )}
              >
                {day.ramadanDay}
              </span>
              {!isEmpty && (
                <span
                  className={cn(
                    "text-[10px]",
                    day.percentage === 100
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {day.percentage}%
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50" />
          <span>100% complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/10 border border-border" />
          <span>Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted/50 border border-border" />
          <span>No data</span>
        </div>
      </div>

      {/* Selected day detail */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Ramadan Day {selectedDay.ramadanDay} ·{" "}
                  {new Date(selectedDay.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                  aria-label="Close"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </button>
              </div>

              <div className="text-sm text-muted-foreground">
                {selectedDay.completed} of {selectedDay.total} habits completed (
                {selectedDay.percentage}%)
              </div>

              {selectedDay.habitIds.length > 0 && habits && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Completed habits
                  </p>
                  <ul className="space-y-1.5">
                    {selectedDay.habitIds.map((habitId) => {
                      const habit = habits.find((h) => h._id === habitId);
                      if (!habit) return null;
                      const info = CATEGORY_INFO[habit.category as HabitCategory];
                      const Icon = getIcon(habit.icon ?? info?.icon);

                      return (
                        <li
                          key={habitId}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-primary/15">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          {Icon && (
                            <Icon
                              className={cn(
                                "h-3.5 w-3.5 shrink-0",
                                info?.color ?? "text-muted-foreground"
                              )}
                            />
                          )}
                          <span>{habit.title}</span>
                          <span className="text-muted-foreground text-xs">
                            +{habit.xpReward} XP
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {selectedDay.habitIds.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No habits completed on this day.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
