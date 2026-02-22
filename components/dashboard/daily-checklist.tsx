"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getTodayDateString } from "@/lib/gamification";
import { CATEGORY_INFO, type HabitCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useCallback, useRef } from "react";
import { InlineXpPopup } from "@/components/animations/xp-popup";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIcon(iconName: string | undefined): React.ComponentType<any> | null {
  if (!iconName) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<any>>;
  return icons[iconName] || null;
}

interface DailyChecklistProps {
  /** Called when all habits are completed for the day */
  onAllCompleted?: () => void;
  /** Called when a habit is toggled (with the XP change) */
  onHabitToggle?: (completed: boolean, xpChange: number) => void;
}

export function DailyChecklist({ onAllCompleted, onHabitToggle }: DailyChecklistProps) {
  const today = getTodayDateString();
  const habits = useQuery(api.habits.getAllUserHabits);
  const logs = useQuery(api.habitLogs.getLogsForDate, { date: today });
  const toggleHabit = useMutation(api.habitLogs.toggleHabitLog);
  const checkStreak = useMutation(api.habitLogs.checkAndUpdateStreak);

  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<string>>(new Set());
  const prevCompletedCount = useRef(0);

  if (!habits || !logs) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Group habits by category
  const categories = Object.keys(CATEGORY_INFO) as HabitCategory[];
  const habitsByCategory = categories.reduce(
    (acc, cat) => {
      acc[cat] = habits.filter((h) => h.category === cat);
      return acc;
    },
    {} as Record<HabitCategory, typeof habits>
  );

  const completedIds = new Set(
    logs.filter((l) => l.completed).map((l) => l.habitId)
  );

  // Check if all are completed now
  const allCompleted = completedIds.size >= habits.length && habits.length > 0;

  // Detect transition to all completed
  if (completedIds.size > prevCompletedCount.current && allCompleted) {
    // Fire in next tick to avoid setState during render
    setTimeout(() => onAllCompleted?.(), 0);
  }
  prevCompletedCount.current = completedIds.size;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleToggle = useCallback(async (habitId: Id<"habits">, xpReward: number) => {
    const wasCompleted = completedIds.has(habitId);

    // Show XP popup for newly completed habits
    if (!wasCompleted) {
      setRecentlyCompleted((prev) => new Set(prev).add(habitId));
      setTimeout(() => {
        setRecentlyCompleted((prev) => {
          const next = new Set(prev);
          next.delete(habitId);
          return next;
        });
      }, 800);
    }

    const result = await toggleHabit({ habitId, date: today });
    onHabitToggle?.(result.completed, result.xpChange);

    // Check streak after completion
    if (result.completed) {
      await checkStreak({ date: today });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleHabit, checkStreak, today, onHabitToggle]);

  return (
    <div className="space-y-6">
      {categories.map((category, catIndex) => {
        const categoryHabits = habitsByCategory[category];
        if (categoryHabits.length === 0) return null;

        const info = CATEGORY_INFO[category];
        const completedInCategory = categoryHabits.filter((h) =>
          completedIds.has(h._id)
        ).length;
        const allInCategoryDone = completedInCategory === categoryHabits.length;

        return (
          <motion.div
            key={category}
            className="space-y-2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.06, ease: "easeOut" as const }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-md transition-colors",
                    allInCategoryDone ? "bg-primary/15" : info.bgColor
                  )}
                >
                  {(() => {
                    const Icon = getIcon(info.icon);
                    return Icon ? (
                      <Icon className={cn(
                        "h-3.5 w-3.5",
                        allInCategoryDone ? "text-primary" : info.color
                      )} />
                    ) : null;
                  })()}
                </div>
                <h3 className="text-sm font-medium">{info.label}</h3>
              </div>
              <span className={cn(
                "text-xs",
                allInCategoryDone
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              )}>
                {completedInCategory}/{categoryHabits.length}
              </span>
            </div>

            <div className="space-y-1.5">
              <AnimatePresence>
                {categoryHabits.map((habit, habitIndex) => {
                  const isCompleted = completedIds.has(habit._id);
                  const HabitIcon = getIcon(habit.icon ?? undefined);
                  const showXpPopup = recentlyCompleted.has(habit._id);

                  return (
                    <motion.button
                      key={habit._id}
                      layout
                      onClick={() => handleToggle(habit._id, habit.xpReward)}
                      className={cn(
                        "relative w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors border",
                        isCompleted
                          ? "bg-primary/5 border-primary/20"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: catIndex * 0.06 + habitIndex * 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ x: 2 }}
                    >
                      {/* Checkmark circle */}
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all shrink-0",
                          isCompleted
                            ? "bg-primary border-primary shadow-sm shadow-primary/30"
                            : "border-muted-foreground/30"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {isCompleted && (
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0, rotate: 45 }}
                              transition={{
                                type: "spring",
                                bounce: 0.6,
                                duration: 0.4,
                              }}
                            >
                              <Check className="h-3.5 w-3.5 text-primary-foreground" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Completion glow ring */}
                      <AnimatePresence>
                        {showXpPopup && (
                          <motion.div
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-primary/40"
                            initial={{ scale: 1, opacity: 0.8 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          />
                        )}
                      </AnimatePresence>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-medium transition-colors",
                            isCompleted && "text-muted-foreground line-through"
                          )}
                        >
                          {habit.title}
                        </p>
                      </div>

                      <div className="relative flex items-center gap-1.5 shrink-0">
                        {HabitIcon && (
                          <HabitIcon
                            className={cn(
                              "h-3.5 w-3.5",
                              isCompleted
                                ? "text-muted-foreground"
                                : info.color
                            )}
                          />
                        )}
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isCompleted
                              ? "text-muted-foreground"
                              : "text-primary"
                          )}
                        >
                          +{habit.xpReward} XP
                        </span>

                        {/* Inline XP popup */}
                        <InlineXpPopup xp={habit.xpReward} show={showXpPopup} />
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
