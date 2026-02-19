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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getIcon(iconName: string | undefined): React.ComponentType<any> | null {
  if (!iconName) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<any>>;
  return icons[iconName] || null;
}

export function DailyChecklist() {
  const today = getTodayDateString();
  const habits = useQuery(api.habits.getAllUserHabits);
  const logs = useQuery(api.habitLogs.getLogsForDate, { date: today });
  const toggleHabit = useMutation(api.habitLogs.toggleHabitLog);

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

  const handleToggle = async (habitId: Id<"habits">) => {
    await toggleHabit({ habitId, date: today });
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryHabits = habitsByCategory[category];
        if (categoryHabits.length === 0) return null;

        const info = CATEGORY_INFO[category];
        const completedInCategory = categoryHabits.filter((h) =>
          completedIds.has(h._id)
        ).length;

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-md",
                    info.bgColor
                  )}
                >
                  {(() => {
                    const Icon = getIcon(info.icon);
                    return Icon ? (
                      <Icon className={cn("h-3.5 w-3.5", info.color)} />
                    ) : null;
                  })()}
                </div>
                <h3 className="text-sm font-medium">{info.label}</h3>
              </div>
              <span className="text-xs text-muted-foreground">
                {completedInCategory}/{categoryHabits.length}
              </span>
            </div>

            <div className="space-y-1.5">
              <AnimatePresence>
                {categoryHabits.map((habit) => {
                  const isCompleted = completedIds.has(habit._id);
                  const HabitIcon = getIcon(habit.icon ?? undefined);

                  return (
                    <motion.button
                      key={habit._id}
                      layout
                      onClick={() => handleToggle(habit._id)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors border",
                        isCompleted
                          ? "bg-primary/5 border-primary/20"
                          : "bg-card border-border hover:bg-muted/50"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors shrink-0",
                          isCompleted
                            ? "bg-primary border-primary"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>

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

                      <div className="flex items-center gap-1.5 shrink-0">
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
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
