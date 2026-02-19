import { query } from "./_generated/server";

// Get all badges for the current user
export const getUserBadges = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("badges")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});
