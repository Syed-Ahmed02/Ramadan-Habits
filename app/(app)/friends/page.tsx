"use client";

import { motion } from "motion/react";
import { Users, UserPlus, Inbox, Trophy } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSearch } from "@/components/social/user-search";
import { FriendCard } from "@/components/social/friend-card";
import { FriendRequestCard } from "@/components/social/friend-request-card";
import { Leaderboard } from "@/components/social/leaderboard";

export default function FriendsPage() {
  const friends = useQuery(api.friendships.getFriends);
  const pendingRequests = useQuery(api.friendships.getPendingRequests);
  const sentRequests = useQuery(api.friendships.getSentRequests);

  const pendingCount = pendingRequests?.length ?? 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Friends</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect with friends and track each other&apos;s progress
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Tabs defaultValue="friends">
          <TabsList>
            <TabsTrigger value="friends">
              <Users className="h-4 w-4 mr-1.5" />
              Friends{friends ? ` (${friends.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-1.5" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Inbox className="h-4 w-4 mr-1.5" />
              Requests{pendingCount > 0 ? ` (${pendingCount})` : ""}
            </TabsTrigger>
            <TabsTrigger value="search">
              <UserPlus className="h-4 w-4 mr-1.5" />
              Add Friends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends">
            <div className="space-y-2">
              {friends === undefined && (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Loading...
                </div>
              )}
              {friends && friends.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No friends yet</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Search for users to add as friends
                    </p>
                  </div>
                </div>
              )}
              {friends?.map((friend, i) =>
                friend ? (
                  <FriendCard
                    key={friend.friendshipId}
                    friendshipId={friend.friendshipId}
                    name={friend.name}
                    username={friend.username}
                    avatarUrl={friend.avatarUrl}
                    level={friend.level}
                    xp={friend.xp}
                    streak={friend.streak}
                    index={i}
                  />
                ) : null
              )}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard />
          </TabsContent>

          <TabsContent value="requests">
            <div className="space-y-4">
              {/* Received requests */}
              {pendingRequests && pendingRequests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Received ({pendingRequests.length})
                  </h3>
                  {pendingRequests.map((request, i) =>
                    request.sender ? (
                      <FriendRequestCard
                        key={request._id}
                        friendshipId={request._id}
                        name={request.sender.name}
                        username={request.sender.username}
                        avatarUrl={request.sender.avatarUrl}
                        level={request.sender.level}
                        streak={request.sender.streak}
                        type="received"
                        index={i}
                      />
                    ) : null
                  )}
                </div>
              )}

              {/* Sent requests */}
              {sentRequests && sentRequests.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Sent ({sentRequests.length})
                  </h3>
                  {sentRequests.map((request, i) =>
                    request.receiver ? (
                      <FriendRequestCard
                        key={request._id}
                        friendshipId={request._id}
                        name={request.receiver.name}
                        username={request.receiver.username}
                        avatarUrl={request.receiver.avatarUrl}
                        level={request.receiver.level}
                        streak={request.receiver.streak}
                        type="sent"
                        index={i}
                      />
                    ) : null
                  )}
                </div>
              )}

              {/* No requests */}
              {pendingRequests?.length === 0 && sentRequests?.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-8 text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                    <Inbox className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">No pending requests</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Friend requests will show up here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search">
            <UserSearch />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
