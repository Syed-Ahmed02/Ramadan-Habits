import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all notifications for the current user (newest first)
export const getNotifications = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .take(50);

    // Enrich with related user info
    const enriched = await Promise.all(
      notifications.map(async (notification) => {
        let relatedUser = null;
        if (notification.relatedUserId) {
          const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) =>
              q.eq("clerkId", notification.relatedUserId!)
            )
            .unique();
          if (user) {
            relatedUser = {
              name: user.name,
              username: user.username,
              avatarUrl: user.avatarUrl,
            };
          }
        }
        return { ...notification, relatedUser };
      })
    );

    return enriched;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) =>
        q.eq("userId", identity.subject).eq("read", false)
      )
      .collect();

    return unread.length;
  },
});

// Mark a notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.notificationId, { read: true });
    return { success: true };
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const unread = await ctx.db
      .query("notifications")
      .withIndex("by_userId_read", (q) =>
        q.eq("userId", identity.subject).eq("read", false)
      )
      .collect();

    await Promise.all(
      unread.map((notification) =>
        ctx.db.patch(notification._id, { read: true })
      )
    );

    return { success: true, count: unread.length };
  },
});

// Create a notification (called internally by other mutations)
export const createNotification = mutation({
  args: {
    userId: v.string(),
    type: v.string(),
    message: v.string(),
    relatedUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      message: args.message,
      read: false,
      relatedUserId: args.relatedUserId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Delete a notification
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    if (notification.userId !== identity.subject) {
      throw new Error("Not authorized");
    }

    await ctx.db.delete(args.notificationId);
    return { success: true };
  },
});
