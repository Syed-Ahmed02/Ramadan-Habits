"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, UserMinus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel";

interface FriendCardProps {
  friendshipId: Id<"friendships">;
  name: string;
  username: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streak: number;
  index?: number;
}

export function FriendCard({
  friendshipId,
  name,
  username,
  avatarUrl,
  level,
  xp,
  streak,
  index = 0,
}: FriendCardProps) {
  const removeFriend = useMutation(api.friendships.removeFriend);
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeFriend({ friendshipId });
    } catch {
      setRemoving(false);
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
          <Avatar size="lg">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">@{username}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">Lvl {level}</span>
              <span className="text-xs text-muted-foreground">-</span>
              <span className="text-xs text-muted-foreground">{xp.toLocaleString()} XP</span>
              {streak > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="flex items-center gap-0.5 text-xs text-orange-500">
                    <Flame className="h-3 w-3" />
                    {streak}
                  </span>
                </>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={removing}
            className="text-muted-foreground hover:text-destructive"
          >
            <UserMinus className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
