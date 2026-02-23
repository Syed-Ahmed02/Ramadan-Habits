"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Flame } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel";

interface FriendRequestCardProps {
  friendshipId: Id<"friendships">;
  name: string;
  username: string;
  avatarUrl?: string;
  level: number;
  streak: number;
  type: "received" | "sent";
  index?: number;
}

export function FriendRequestCard({
  friendshipId,
  name,
  username,
  avatarUrl,
  level,
  streak,
  type,
  index = 0,
}: FriendRequestCardProps) {
  const acceptRequest = useMutation(api.friendships.acceptFriendRequest);
  const declineRequest = useMutation(api.friendships.declineFriendRequest);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptRequest({ friendshipId });
    } catch {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await declineRequest({ friendshipId });
    } catch {
      setLoading(false);
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card size="sm">
        <CardContent className="flex items-center gap-3">
          <Avatar>
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground truncate">@{username}</p>
              <span className="text-xs text-muted-foreground">- Lvl {level}</span>
              {streak > 0 && (
                <span className="flex items-center gap-0.5 text-xs text-orange-500">
                  <Flame className="h-3 w-3" />
                  {streak}
                </span>
              )}
            </div>
          </div>

          {type === "received" ? (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAccept}
                disabled={loading}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDecline}
                disabled={loading}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">Pending</span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
