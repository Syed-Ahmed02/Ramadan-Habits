"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { RAMADAN_START_DATE } from "@/lib/constants";
import {
  getRamadanDateRange,
  getDailyCompletionPercentage,
} from "@/lib/gamification";
import { motion } from "motion/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CATEGORY_INFO, type HabitCategory } from "@/lib/constants";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ProgressCharts() {
  const allLogs = useQuery(api.habitLogs.getAllLogs);
  const habits = useQuery(api.habits.getAllUserHabits);

  if (!allLogs || !habits) {
    return (
      <div className="space-y-6">
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
        <div className="h-48 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  const dateRange = getRamadanDateRange(RAMADAN_START_DATE);
  const totalHabits = habits.length;
  const habitById = new Map(habits.map((h) => [h._id, h]));

  // Build daily XP and completion data
  const logByDate = new Map<string, typeof allLogs>();
  for (const log of allLogs) {
    if (!logByDate.has(log.date)) {
      logByDate.set(log.date, []);
    }
    logByDate.get(log.date)!.push(log);
  }

  const dailyStats = dateRange.map((date, i) => {
    const logs = logByDate.get(date) ?? [];
    const completedLogs = logs.filter((l) => l.completed);
    let xpEarned = 0;
    for (const log of completedLogs) {
      const habit = habitById.get(log.habitId);
      if (habit) xpEarned += habit.xpReward;
    }
    const percentage = getDailyCompletionPercentage(
      completedLogs.length,
      totalHabits
    );

    return {
      day: i + 1,
      xp: xpEarned,
      completed: completedLogs.length,
      total: totalHabits,
      percentage,
      date,
    };
  });

  // Category breakdown - count completed habits per category
  const categoryCounts = new Map<string, number>();
  for (const log of allLogs) {
    if (!log.completed) continue;
    const habit = habitById.get(log.habitId);
    if (habit) {
      const label = CATEGORY_INFO[habit.category as HabitCategory]?.label ?? habit.category;
      categoryCounts.set(label, (categoryCounts.get(label) ?? 0) + 1);
    }
  }

  const categoryData = Array.from(categoryCounts.entries()).map(
    ([name, value]) => ({ name, value })
  );

  const totalXp = dailyStats.reduce((sum, d) => sum + d.xp, 0);
  const perfectDays = dailyStats.filter((d) => d.percentage === 100).length;
  const avgCompletion =
    dailyStats.filter((d) => d.total > 0).length > 0
      ? Math.round(
          dailyStats
            .filter((d) => d.total > 0)
            .reduce((sum, d) => sum + d.percentage, 0) /
            dailyStats.filter((d) => d.total > 0).length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <StatCard label="Total XP" value={totalXp.toLocaleString()} />
        <StatCard label="Perfect days" value={perfectDays} subLabel="of 30" />
        <StatCard label="Avg completion" value={`${avgCompletion}%`} />
        <StatCard label="Habits tracked" value={totalHabits} />
      </motion.div>

      {/* Daily XP Bar Chart */}
      <motion.div
        className="rounded-xl border border-border bg-card p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-medium mb-4">Daily XP Earned</h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyStats}
              margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload && payload[0] ? (
                    <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
                      <p className="font-medium">
                        Day {payload[0].payload.day}
                      </p>
                      <p className="text-muted-foreground">
                        {payload[0].payload.xp} XP ·{" "}
                        {payload[0].payload.percentage}% complete
                      </p>
                    </div>
                  ) : null
                }
              />
              <Bar
                dataKey="xp"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category breakdown (only if we have data) */}
      {categoryData.length > 0 && (
        <motion.div
          className="rounded-xl border border-border bg-card p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium mb-4">Completions by Category</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={2}
                  label={({ name, percent }) =>
                    (percent ?? 0) >= 0.08 ? `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : ""
                  }
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload && payload[0] ? (
                      <div className="rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-md">
                        <p className="font-medium">{payload[0].name}</p>
                        <p className="text-muted-foreground">
                          {payload[0].value} completions
                        </p>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  subLabel,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold">
        {value}
        {subLabel && (
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {subLabel}
          </span>
        )}
      </p>
    </div>
  );
}
