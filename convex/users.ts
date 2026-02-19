import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get or create a user record from Clerk identity
export const getOrCreateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existing) {
      return existing;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId,
      name: identity.name ?? "User",
      email: identity.email ?? "",
      username: identity.preferredUsername ?? identity.email?.split("@")[0] ?? `user_${Date.now()}`,
      avatarUrl: identity.pictureUrl,
      level: 1,
      xp: 0,
      streak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});

// Get the current authenticated user
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check username uniqueness if changing
    if (args.username && args.username !== user.username) {
      const existingUsername = await ctx.db
        .query("users")
        .withIndex("by_username", (q) => q.eq("username", args.username!))
        .unique();
      if (existingUsername) {
        throw new Error("Username already taken");
      }
    }

    const updates: Record<string, string> = {};
    if (args.name) updates.name = args.name;
    if (args.username) updates.username = args.username;

    await ctx.db.patch(user._id, updates);
    return await ctx.db.get(user._id);
  },
});

// Update user XP and level (internal helper, called from habitLogs)
export const addXp = mutation({
  args: {
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const newXp = user.xp + args.amount;
    // Calculate new level: Level N requires N * 100 total XP (cumulative)
    const XP_PER_LEVEL = 100;
    const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
    const newLevel = Math.min(Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1), 30);

    await ctx.db.patch(user._id, {
      xp: newXp,
      level: newLevel,
    });

    return { newXp, newLevel, leveledUp: newLevel > user.level };
  },
});

// Update user streak
export const updateStreak = mutation({
  args: {
    streak: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      streak: args.streak,
      longestStreak: Math.max(user.longestStreak, args.streak),
    });
  },
});
