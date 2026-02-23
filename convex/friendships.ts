import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Search users by username or email (excluding current user)
export const searchUsers = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const searchTerm = args.query.toLowerCase().trim();
    if (searchTerm.length < 2) return [];

    // Get all users and filter client-side (Convex doesn't support LIKE queries)
    const allUsers = await ctx.db.query("users").collect();

    return allUsers
      .filter((user) => {
        if (user.clerkId === identity.subject) return false;
        return (
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.name.toLowerCase().includes(searchTerm)
        );
      })
      .slice(0, 10)
      .map((user) => ({
        _id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        level: user.level,
        streak: user.streak,
      }));
  },
});

// Send a friend request
export const sendFriendRequest = mutation({
  args: { receiverId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const senderId = identity.subject;

    if (senderId === args.receiverId) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Check if a friendship already exists in either direction
    const existingForward = await ctx.db
      .query("friendships")
      .withIndex("by_senderId_receiverId", (q) =>
        q.eq("senderId", senderId).eq("receiverId", args.receiverId)
      )
      .unique();

    const existingReverse = await ctx.db
      .query("friendships")
      .withIndex("by_senderId_receiverId", (q) =>
        q.eq("senderId", args.receiverId).eq("receiverId", senderId)
      )
      .unique();

    if (existingForward || existingReverse) {
      throw new Error("Friend request already exists or you are already friends");
    }

    await ctx.db.insert("friendships", {
      senderId,
      receiverId: args.receiverId,
      status: "pending",
      createdAt: Date.now(),
    });

    // Get sender name for notification
    const senderUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", senderId))
      .unique();

    // Create notification for receiver
    await ctx.db.insert("notifications", {
      userId: args.receiverId,
      type: "friend_request",
      message: `${senderUser?.name ?? "Someone"} sent you a friend request`,
      read: false,
      relatedUserId: senderId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Accept a friend request
export const acceptFriendRequest = mutation({
  args: { friendshipId: v.id("friendships") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Only the receiver can accept
    if (friendship.receiverId !== identity.subject) {
      throw new Error("Not authorized to accept this request");
    }

    if (friendship.status !== "pending") {
      throw new Error("Friend request is no longer pending");
    }

    await ctx.db.patch(args.friendshipId, { status: "accepted" });

    // Get accepter's name for notification
    const accepterUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    // Notify the sender that their request was accepted
    await ctx.db.insert("notifications", {
      userId: friendship.senderId,
      type: "friend_request",
      message: `${accepterUser?.name ?? "Someone"} accepted your friend request`,
      read: false,
      relatedUserId: identity.subject,
      createdAt: Date.now(),
    });

    // Check if sender now has 5 friends -> award social_butterfly badge
    const senderFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_senderId", (q) => q.eq("senderId", friendship.senderId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const senderReceivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", friendship.senderId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const senderFriendCount = senderFriendships.length + senderReceivedFriendships.length;

    if (senderFriendCount >= 5) {
      const existingBadge = await ctx.db
        .query("badges")
        .withIndex("by_userId_badgeType", (q) =>
          q.eq("userId", friendship.senderId).eq("badgeType", "social_butterfly")
        )
        .unique();
      if (!existingBadge) {
        await ctx.db.insert("badges", {
          userId: friendship.senderId,
          badgeType: "social_butterfly",
          earnedAt: Date.now(),
        });
      }
    }

    // Check if receiver (current user) now has 5 friends -> award social_butterfly badge
    const receiverFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_senderId", (q) => q.eq("senderId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const receiverReceivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const receiverFriendCount = receiverFriendships.length + receiverReceivedFriendships.length;

    if (receiverFriendCount >= 5) {
      const existingBadge = await ctx.db
        .query("badges")
        .withIndex("by_userId_badgeType", (q) =>
          q.eq("userId", identity.subject).eq("badgeType", "social_butterfly")
        )
        .unique();
      if (!existingBadge) {
        await ctx.db.insert("badges", {
          userId: identity.subject,
          badgeType: "social_butterfly",
          earnedAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

// Decline a friend request
export const declineFriendRequest = mutation({
  args: { friendshipId: v.id("friendships") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Only the receiver can decline
    if (friendship.receiverId !== identity.subject) {
      throw new Error("Not authorized to decline this request");
    }

    if (friendship.status !== "pending") {
      throw new Error("Friend request is no longer pending");
    }

    await ctx.db.delete(args.friendshipId);
    return { success: true };
  },
});

// Remove a friend (either party can remove)
export const removeFriend = mutation({
  args: { friendshipId: v.id("friendships") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const friendship = await ctx.db.get(args.friendshipId);
    if (!friendship) {
      throw new Error("Friendship not found");
    }

    // Either party can remove
    if (
      friendship.senderId !== identity.subject &&
      friendship.receiverId !== identity.subject
    ) {
      throw new Error("Not authorized to remove this friendship");
    }

    await ctx.db.delete(args.friendshipId);
    return { success: true };
  },
});

// Get pending friend requests received by the current user
export const getPendingRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const pending = await ctx.db
      .query("friendships")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Enrich with sender info
    const enriched = await Promise.all(
      pending.map(async (friendship) => {
        const sender = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", friendship.senderId))
          .unique();
        return {
          ...friendship,
          sender: sender
            ? {
                name: sender.name,
                username: sender.username,
                avatarUrl: sender.avatarUrl,
                level: sender.level,
                streak: sender.streak,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Get sent friend requests (pending)
export const getSentRequests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const sent = await ctx.db
      .query("friendships")
      .withIndex("by_senderId", (q) => q.eq("senderId", identity.subject))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Enrich with receiver info
    const enriched = await Promise.all(
      sent.map(async (friendship) => {
        const receiver = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", friendship.receiverId))
          .unique();
        return {
          ...friendship,
          receiver: receiver
            ? {
                name: receiver.name,
                username: receiver.username,
                avatarUrl: receiver.avatarUrl,
                level: receiver.level,
                streak: receiver.streak,
              }
            : null,
        };
      })
    );

    return enriched;
  },
});

// Get all accepted friends for the current user
export const getFriends = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    // Friends where current user is sender
    const sentFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_senderId", (q) => q.eq("senderId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Friends where current user is receiver
    const receivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    // Get friend user details
    const friends = await Promise.all([
      ...sentFriendships.map(async (f) => {
        const friend = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", f.receiverId))
          .unique();
        return friend
          ? {
              friendshipId: f._id,
              clerkId: friend.clerkId,
              name: friend.name,
              username: friend.username,
              avatarUrl: friend.avatarUrl,
              level: friend.level,
              xp: friend.xp,
              streak: friend.streak,
              longestStreak: friend.longestStreak,
            }
          : null;
      }),
      ...receivedFriendships.map(async (f) => {
        const friend = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", f.senderId))
          .unique();
        return friend
          ? {
              friendshipId: f._id,
              clerkId: friend.clerkId,
              name: friend.name,
              username: friend.username,
              avatarUrl: friend.avatarUrl,
              level: friend.level,
              xp: friend.xp,
              streak: friend.streak,
              longestStreak: friend.longestStreak,
            }
          : null;
      }),
    ]);

    return friends.filter(Boolean);
  },
});

// Get friendship status between current user and another user
export const getFriendshipStatus = query({
  args: { otherUserId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    const forward = await ctx.db
      .query("friendships")
      .withIndex("by_senderId_receiverId", (q) =>
        q.eq("senderId", userId).eq("receiverId", args.otherUserId)
      )
      .unique();

    if (forward) {
      return { status: forward.status, direction: "sent" as const, friendshipId: forward._id };
    }

    const reverse = await ctx.db
      .query("friendships")
      .withIndex("by_senderId_receiverId", (q) =>
        q.eq("senderId", args.otherUserId).eq("receiverId", userId)
      )
      .unique();

    if (reverse) {
      return { status: reverse.status, direction: "received" as const, friendshipId: reverse._id };
    }

    return null;
  },
});
