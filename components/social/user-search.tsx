"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Clock, Check, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function UserSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = useQuery(
    api.friendships.searchUsers,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip"
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by username, name, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <AnimatePresence mode="wait">
        {searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="space-y-2"
          >
            {searchResults === undefined && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Searching...
              </p>
            )}
            {searchResults && searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No users found
              </p>
            )}
            {searchResults?.map((user, i) => (
              <SearchResultItem key={user._id} user={user} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchResultItem({
  user,
  index,
}: {
  user: {
    _id: string;
    clerkId: string;
    name: string;
    username: string;
    avatarUrl?: string;
    level: number;
    streak: number;
  };
  index: number;
}) {
  const sendRequest = useMutation(api.friendships.sendFriendRequest);
  const friendshipStatus = useQuery(api.friendships.getFriendshipStatus, {
    otherUserId: user.clerkId,
  });
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    setSending(true);
    try {
      await sendRequest({ receiverId: user.clerkId });
    } catch {
      setSending(false);
    }
  };

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getActionButton = () => {
    if (friendshipStatus === undefined) return null;

    if (friendshipStatus?.status === "accepted") {
      return (
        <Button variant="ghost" size="sm" disabled>
          <Check className="h-4 w-4 mr-1" />
          Friends
        </Button>
      );
    }

    if (friendshipStatus?.status === "pending") {
      return (
        <Button variant="ghost" size="sm" disabled>
          <Clock className="h-4 w-4 mr-1" />
          {friendshipStatus.direction === "sent" ? "Sent" : "Pending"}
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleSendRequest}
        disabled={sending}
      >
        <UserPlus className="h-4 w-4 mr-1" />
        Add
      </Button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card size="sm">
        <CardContent className="flex items-center gap-3">
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
              <span className="text-xs text-muted-foreground">- Lvl {user.level}</span>
              {user.streak > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-orange-500">
                  <Flame className="h-3 w-3" />
                  {user.streak}
                </span>
              )}
            </div>
          </div>

          {getActionButton()}
        </CardContent>
      </Card>
    </motion.div>
  );
}
