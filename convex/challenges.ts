import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new challenge
export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    habitId: v.optional(v.id("habits")),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challengeId = await ctx.db.insert("challenges", {
      creatorId: identity.subject,
      title: args.title,
      description: args.description,
      habitId: args.habitId,
      startDate: args.startDate,
      endDate: args.endDate,
      participantIds: [identity.subject],
      createdAt: Date.now(),
    });

    return challengeId;
  },
});

// Join a challenge
export const joinChallenge = mutation({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.participantIds.includes(identity.subject)) {
      throw new Error("Already joined this challenge");
    }

    await ctx.db.patch(args.challengeId, {
      participantIds: [...challenge.participantIds, identity.subject],
    });

    // Notify the challenge creator
    const joiner = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    await ctx.db.insert("notifications", {
      userId: challenge.creatorId,
      type: "challenge_invite",
      message: `${joiner?.name ?? "Someone"} joined your challenge "${challenge.title}"`,
      read: false,
      relatedUserId: identity.subject,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Leave a challenge
export const leaveChallenge = mutation({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.creatorId === identity.subject) {
      throw new Error("Creator cannot leave. Delete the challenge instead.");
    }

    await ctx.db.patch(args.challengeId, {
      participantIds: challenge.participantIds.filter(
        (id) => id !== identity.subject
      ),
    });

    return { success: true };
  },
});

// Delete a challenge (only creator)
export const deleteChallenge = mutation({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.creatorId !== identity.subject) {
      throw new Error("Only the creator can delete this challenge");
    }

    await ctx.db.delete(args.challengeId);
    return { success: true };
  },
});

// Invite a friend to a challenge
export const inviteToChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
    friendClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (!challenge.participantIds.includes(identity.subject)) {
      throw new Error("You must be a participant to invite others");
    }

    // Send notification to friend
    const inviter = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    await ctx.db.insert("notifications", {
      userId: args.friendClerkId,
      type: "challenge_invite",
      message: `${inviter?.name ?? "Someone"} invited you to "${challenge.title}"`,
      read: false,
      relatedUserId: identity.subject,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Get challenges the current user is participating in
export const getMyChallenges = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Get challenges created by user
    const created = await ctx.db
      .query("challenges")
      .withIndex("by_creatorId", (q) => q.eq("creatorId", identity.subject))
      .collect();

    // Get all challenges to find ones user is participating in
    const allChallenges = await ctx.db.query("challenges").collect();
    const participating = allChallenges.filter(
      (c) =>
        c.participantIds.includes(identity.subject) &&
        c.creatorId !== identity.subject
    );

    const all = [...created, ...participating];

    // Enrich with creator info and participant count
    const enriched = await Promise.all(
      all.map(async (challenge) => {
        const creator = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", challenge.creatorId))
          .unique();

        // Get habit info if linked
        let habitTitle = null;
        if (challenge.habitId) {
          const habit = await ctx.db.get(challenge.habitId);
          habitTitle = habit?.title ?? null;
        }

        return {
          ...challenge,
          creatorName: creator?.name ?? "Unknown",
          creatorAvatarUrl: creator?.avatarUrl,
          participantCount: challenge.participantIds.length,
          habitTitle,
          isCreator: challenge.creatorId === identity.subject,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get available challenges to join (from friends)
export const getAvailableChallenges = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;

    // Get friend clerkIds
    const sentFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_senderId", (q) => q.eq("senderId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const receivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_receiverId", (q) => q.eq("receiverId", userId))
      .filter((q) => q.eq(q.field("status"), "accepted"))
      .collect();

    const friendClerkIds = [
      ...sentFriendships.map((f) => f.receiverId),
      ...receivedFriendships.map((f) => f.senderId),
    ];

    // Get all challenges from friends that user hasn't joined
    const allChallenges = await ctx.db.query("challenges").collect();
    const available = allChallenges.filter(
      (c) =>
        friendClerkIds.includes(c.creatorId) &&
        !c.participantIds.includes(userId)
    );

    const enriched = await Promise.all(
      available.map(async (challenge) => {
        const creator = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", challenge.creatorId))
          .unique();

        let habitTitle = null;
        if (challenge.habitId) {
          const habit = await ctx.db.get(challenge.habitId);
          habitTitle = habit?.title ?? null;
        }

        return {
          ...challenge,
          creatorName: creator?.name ?? "Unknown",
          creatorAvatarUrl: creator?.avatarUrl,
          participantCount: challenge.participantIds.length,
          habitTitle,
          isCreator: false,
        };
      })
    );

    return enriched.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get challenge details with participant progress
export const getChallengeDetails = query({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) return null;

    // Get participant details with their progress
    const participants = await Promise.all(
      challenge.participantIds.map(async (clerkId) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
          .unique();

        // Calculate progress: count completed days in the challenge period
        let completedDays = 0;
        if (challenge.habitId) {
          const logs = await ctx.db
            .query("habitLogs")
            .withIndex("by_userId", (q) => q.eq("userId", clerkId))
            .filter((q) =>
              q.and(
                q.eq(q.field("habitId"), challenge.habitId!),
                q.eq(q.field("completed"), true),
                q.gte(q.field("date"), challenge.startDate),
                q.lte(q.field("date"), challenge.endDate)
              )
            )
            .collect();
          completedDays = logs.length;
        } else {
          // No specific habit - count days with any completion
          const logs = await ctx.db
            .query("habitLogs")
            .withIndex("by_userId", (q) => q.eq("userId", clerkId))
            .filter((q) =>
              q.and(
                q.eq(q.field("completed"), true),
                q.gte(q.field("date"), challenge.startDate),
                q.lte(q.field("date"), challenge.endDate)
              )
            )
            .collect();
          // Count unique days
          const uniqueDays = new Set(logs.map((l) => l.date));
          completedDays = uniqueDays.size;
        }

        // Calculate total days in challenge
        const start = new Date(challenge.startDate);
        const end = new Date(challenge.endDate);
        const totalDays =
          Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        return {
          clerkId,
          name: user?.name ?? "Unknown",
          username: user?.username ?? "unknown",
          avatarUrl: user?.avatarUrl,
          level: user?.level ?? 1,
          completedDays,
          totalDays,
          percentage: Math.round((completedDays / totalDays) * 100),
        };
      })
    );

    // Sort by progress
    participants.sort((a, b) => b.completedDays - a.completedDays);

    const creator = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", challenge.creatorId))
      .unique();

    let habitTitle = null;
    if (challenge.habitId) {
      const habit = await ctx.db.get(challenge.habitId);
      habitTitle = habit?.title ?? null;
    }

    return {
      ...challenge,
      creatorName: creator?.name ?? "Unknown",
      habitTitle,
      participants,
      isCreator: challenge.creatorId === identity.subject,
      isParticipant: challenge.participantIds.includes(identity.subject),
    };
  },
});

// Complete a challenge - awards bonus XP to all participants
const CHALLENGE_BONUS_XP = 50;

export const completeChallenge = mutation({
  args: { challengeId: v.id("challenges") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) {
      throw new Error("Challenge not found");
    }

    if (challenge.creatorId !== identity.subject) {
      throw new Error("Only the creator can complete this challenge");
    }

    if (challenge.status === "completed") {
      throw new Error("Challenge is already completed");
    }

    // Mark challenge as completed
    await ctx.db.patch(args.challengeId, {
      status: "completed",
      completedAt: Date.now(),
    });

    // Award bonus XP to each participant and check for challenge_master badge
    for (const participantId of challenge.participantIds) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerkId", (q) => q.eq("clerkId", participantId))
        .unique();

      if (user) {
        // Award bonus XP
        const newXp = user.xp + CHALLENGE_BONUS_XP;
        const XP_PER_LEVEL = 100;
        const discriminant = 1 + (8 * newXp) / XP_PER_LEVEL;
        const newLevel = Math.min(
          Math.max(Math.floor((-1 + Math.sqrt(discriminant)) / 2), 1),
          30
        );
        await ctx.db.patch(user._id, { xp: newXp, level: newLevel });

        // Send notification to participant
        if (participantId !== identity.subject) {
          await ctx.db.insert("notifications", {
            userId: participantId,
            type: "challenge_invite",
            message: `Challenge "${challenge.title}" completed! You earned ${CHALLENGE_BONUS_XP} bonus XP!`,
            read: false,
            relatedUserId: identity.subject,
            createdAt: Date.now(),
          });
        }

        // Check if participant has now completed 3 challenges -> challenge_master badge
        const allChallenges = await ctx.db.query("challenges").collect();
        const completedCount = allChallenges.filter(
          (c) =>
            c.status === "completed" &&
            c.participantIds.includes(participantId)
        ).length;

        if (completedCount >= 3) {
          const existingBadge = await ctx.db
            .query("badges")
            .withIndex("by_userId_badgeType", (q) =>
              q.eq("userId", participantId).eq("badgeType", "challenge_master")
            )
            .unique();

          if (!existingBadge) {
            await ctx.db.insert("badges", {
              userId: participantId,
              badgeType: "challenge_master",
              earnedAt: Date.now(),
            });
          }
        }
      }
    }

    return { success: true, bonusXp: CHALLENGE_BONUS_XP };
  },
});
