import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    username: v.string(),
    avatarUrl: v.optional(v.string()),
    level: v.number(),
    xp: v.number(),
    streak: v.number(),
    longestStreak: v.number(),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  habits: defineTable({
    userId: v.optional(v.string()),
    title: v.string(),
    category: v.string(),
    description: v.optional(v.string()),
    xpReward: v.number(),
    isDefault: v.boolean(),
    icon: v.optional(v.string()),
    order: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_isDefault", ["isDefault"])
    .index("by_category", ["category"]),

  habitLogs: defineTable({
    userId: v.string(),
    habitId: v.id("habits"),
    date: v.string(),
    completed: v.boolean(),
    completedAt: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_date", ["userId", "date"])
    .index("by_habitId_date", ["habitId", "date"])
    .index("by_userId_habitId_date", ["userId", "habitId", "date"]),

  friendships: defineTable({
    senderId: v.string(),
    receiverId: v.string(),
    status: v.string(),
    createdAt: v.number(),
  })
    .index("by_senderId", ["senderId"])
    .index("by_receiverId", ["receiverId"])
    .index("by_senderId_receiverId", ["senderId", "receiverId"]),

  challenges: defineTable({
    creatorId: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    habitId: v.optional(v.id("habits")),
    startDate: v.string(),
    endDate: v.string(),
    participantIds: v.array(v.string()),
    status: v.optional(v.string()), // "active" | "completed"
    completedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_creatorId", ["creatorId"]),

  notifications: defineTable({
    userId: v.string(),
    type: v.string(),
    message: v.string(),
    read: v.boolean(),
    relatedUserId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_read", ["userId", "read"]),

  badges: defineTable({
    userId: v.string(),
    badgeType: v.string(),
    earnedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_badgeType", ["userId", "badgeType"]),
});
