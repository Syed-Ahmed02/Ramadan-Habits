import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all default habits
export const getDefaultHabits = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .collect();
  },
});

// Get default habits by category
export const getDefaultHabitsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("habits")
      .filter((q) =>
        q.and(
          q.eq(q.field("isDefault"), true),
          q.eq(q.field("category"), args.category)
        )
      )
      .collect();
  },
});

// Get user's custom habits
export const getUserHabits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("habits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

// Get all habits available to the user (defaults + custom)
export const getAllUserHabits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const defaults = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .collect();

    const custom = await ctx.db
      .query("habits")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return [...defaults, ...custom].sort((a, b) => a.order - b.order);
  },
});

// Create a custom habit
export const createHabit = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    xpReward: v.number(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the highest order number
    const allHabits = await ctx.db.query("habits").collect();
    const maxOrder = allHabits.reduce((max, h) => Math.max(max, h.order), 0);

    const habitId = await ctx.db.insert("habits", {
      userId: identity.subject,
      title: args.title,
      category: args.category,
      description: args.description,
      xpReward: args.xpReward,
      icon: args.icon,
      order: maxOrder + 1,
      isDefault: false,
    });

    return habitId;
  },
});

// Update a custom habit
export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    title: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    xpReward: v.optional(v.number()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    // Can only edit own custom habits
    if (habit.isDefault || habit.userId !== identity.subject) {
      throw new Error("Cannot edit this habit");
    }

    const updates: Record<string, unknown> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.category !== undefined) updates.category = args.category;
    if (args.description !== undefined) updates.description = args.description;
    if (args.xpReward !== undefined) updates.xpReward = args.xpReward;
    if (args.icon !== undefined) updates.icon = args.icon;

    await ctx.db.patch(args.habitId, updates);
  },
});

// Delete a custom habit
export const deleteHabit = mutation({
  args: {
    habitId: v.id("habits"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const habit = await ctx.db.get(args.habitId);
    if (!habit) {
      throw new Error("Habit not found");
    }

    if (habit.isDefault || habit.userId !== identity.subject) {
      throw new Error("Cannot delete this habit");
    }

    await ctx.db.delete(args.habitId);
  },
});
