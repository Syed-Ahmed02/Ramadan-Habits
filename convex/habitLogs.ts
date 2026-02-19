import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Toggle a habit log for a specific date (complete/uncomplete)
export const toggleHabitLog = mutation({
  args: {
    habitId: v.id("habits"),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    // Check if a log already exists for this habit + date
    const existing = await ctx.db
      .query("habitLogs")
      .withIndex("by_userId_habitId_date", (q) =>
        q.eq("userId", userId).eq("habitId", args.habitId).eq("date", args.date)
      )
      .unique();

    if (existing) {
      if (existing.completed) {
        // Uncomplete it
        await ctx.db.patch(existing._id, {
          completed: false,
          completedAt: undefined,
        });

        // Subtract XP
        const habit = await ctx.db.get(args.habitId);
        if (habit) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
            .unique();
          if (user) {
            const newXp = Math.max(0, user.xp - habit.xpReward);
            const XP_PER_LEVEL = 100;
            const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
            const newLevel = Math.min(
              Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1),
              30
            );
            await ctx.db.patch(user._id, { xp: newXp, level: newLevel });
          }
        }

        return { completed: false, xpChange: -(habit?.xpReward ?? 0) };
      } else {
        // Re-complete it
        await ctx.db.patch(existing._id, {
          completed: true,
          completedAt: Date.now(),
        });

        // Add XP
        const habit = await ctx.db.get(args.habitId);
        if (habit) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
            .unique();
          if (user) {
            const newXp = user.xp + habit.xpReward;
            const XP_PER_LEVEL = 100;
            const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
            const newLevel = Math.min(
              Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1),
              30
            );
            await ctx.db.patch(user._id, { xp: newXp, level: newLevel });
          }
        }

        return { completed: true, xpChange: habit?.xpReward ?? 0 };
      }
    } else {
      // Create new log as completed
      await ctx.db.insert("habitLogs", {
        userId,
        habitId: args.habitId,
        date: args.date,
        completed: true,
        completedAt: Date.now(),
      });

      // Add XP
      const habit = await ctx.db.get(args.habitId);
      if (habit) {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
          .unique();
        if (user) {
          const newXp = user.xp + habit.xpReward;
          const XP_PER_LEVEL = 100;
          const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
          const newLevel = Math.min(
            Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1),
            30
          );
          await ctx.db.patch(user._id, { xp: newXp, level: newLevel });

          // Check if this is the user's first ever habit completion -> badge
          const allLogs = await ctx.db
            .query("habitLogs")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("completed"), true))
            .collect();

          if (allLogs.length === 1) {
            // First habit ever completed - award "first_step" badge
            const existingBadge = await ctx.db
              .query("badges")
              .withIndex("by_userId_badgeType", (q) =>
                q.eq("userId", userId).eq("badgeType", "first_step")
              )
              .unique();
            if (!existingBadge) {
              await ctx.db.insert("badges", {
                userId,
                badgeType: "first_step",
                earnedAt: Date.now(),
              });
            }
          }
        }
      }

      return { completed: true, xpChange: habit?.xpReward ?? 0 };
    }
  },
});

// Get habit logs for a specific date
export const getLogsForDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("habitLogs")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("date", args.date)
      )
      .collect();
  },
});

// Get all habit logs for the current user
export const getAllLogs = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("habitLogs")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// Get completion stats for today
export const getTodayStats = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { completed: 0, total: 0, xpEarned: 0 };

    const logs = await ctx.db
      .query("habitLogs")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", identity.subject).eq("date", args.date)
      )
      .collect();

    const completedLogs = logs.filter((l) => l.completed);

    // Calculate XP earned today
    let xpEarned = 0;
    for (const log of completedLogs) {
      const habit = await ctx.db.get(log.habitId);
      if (habit) xpEarned += habit.xpReward;
    }

    // Get total habits available
    const defaultHabits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .collect();

    const customHabits = await ctx.db
      .query("habits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return {
      completed: completedLogs.length,
      total: defaultHabits.length + customHabits.length,
      xpEarned,
    };
  },
});

// Check and update streak
export const checkAndUpdateStreak = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Get all habits available to user
    const defaultHabits = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .collect();

    const customHabits = await ctx.db
      .query("habits")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const allHabits = [...defaultHabits, ...customHabits];

    // Get today's logs
    const todayLogs = await ctx.db
      .query("habitLogs")
      .withIndex("by_userId_date", (q) =>
        q.eq("userId", userId).eq("date", args.date)
      )
      .collect();

    const completedToday = todayLogs.filter((l) => l.completed);

    // Check if ALL habits are completed today
    if (completedToday.length >= allHabits.length && allHabits.length > 0) {
      // Check yesterday
      const yesterday = new Date(args.date);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const yesterdayLogs = await ctx.db
        .query("habitLogs")
        .withIndex("by_userId_date", (q) =>
          q.eq("userId", userId).eq("date", yesterdayStr)
        )
        .collect();

      const completedYesterday = yesterdayLogs.filter((l) => l.completed);
      const allCompletedYesterday =
        completedYesterday.length >= allHabits.length;

      const newStreak = allCompletedYesterday ? user.streak + 1 : 1;

      await ctx.db.patch(user._id, {
        streak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
      });

      // Check streak milestones for badge awards
      const streakMilestones: Record<number, string> = {
        7: "consistent",
        15: "halfway_there",
        30: "ramadan_champion",
      };

      const badgeType = streakMilestones[newStreak];
      if (badgeType) {
        const existingBadge = await ctx.db
          .query("badges")
          .withIndex("by_userId_badgeType", (q) =>
            q.eq("userId", userId).eq("badgeType", badgeType)
          )
          .unique();
        if (!existingBadge) {
          await ctx.db.insert("badges", {
            userId,
            badgeType,
            earnedAt: Date.now(),
          });
        }

        // Award bonus XP for streak milestones
        const bonusXp: Record<number, number> = {
          3: 50,
          7: 100,
          10: 150,
          14: 200,
          21: 300,
          30: 500,
        };
        const bonus = bonusXp[newStreak];
        if (bonus) {
          const newXp = user.xp + bonus;
          const XP_PER_LEVEL = 100;
          const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
          const newLevel = Math.min(
            Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1),
            30
          );
          await ctx.db.patch(user._id, { xp: newXp, level: newLevel });
        }
      }

      return { streak: newStreak, allCompleted: true };
    }

    return { streak: user.streak, allCompleted: false };
  },
});
