"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, Flame } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type LeaderboardFilter = "all" | "daily" | "weekly";

const FILTER_LABELS: Record<LeaderboardFilter, string> = {
  daily: "Today",
  weekly: "This Week",
  all: "All Time",
};

export function Leaderboard() {
  const [filter, setFilter] = useState<LeaderboardFilter>("all");
  const leaderboard = useQuery(api.friendships.getLeaderboard, { filter });

  const getRankIcon = (rank: number) => {
    if (rank === 0)
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 1)
      return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 2)
      return <Award className="h-4 w-4 text-amber-700" />;
    return (
      <span className="text-xs font-medium text-muted-foreground w-4 text-center">
        {rank + 1}
      </span>
    );
  };

  const getRankBg = (rank: number) => {
    if (rank === 0) return "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/30";
    if (rank === 1) return "bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800/30";
    if (rank === 2) return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30";
    return "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Leaderboard
          </CardTitle>
          <div className="flex items-center gap-1">
            {(Object.entries(FILTER_LABELS) as [LeaderboardFilter, string][]).map(
              ([key, label]) => (
                <Button
                  key={key}
                  variant={filter === key ? "default" : "ghost"}
                  size="sm"
                  className="text-xs h-7 px-2.5"
                  onClick={() => setFilter(key)}
                >
                  {label}
                </Button>
              )
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard === undefined && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          )}
          {leaderboard && leaderboard.length === 0 && (
            <div className="text-sm text-muted-foreground text-center py-6">
              Add friends to see the leaderboard
            </div>
          )}
          {leaderboard?.map((entry, rank) => {
            const initials = entry.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <motion.div
                key={entry.clerkId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rank * 0.05 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 border border-transparent transition-colors",
                  getRankBg(rank),
                  entry.isCurrentUser && "ring-1 ring-primary/30"
                )}
              >
                <div className="flex items-center justify-center w-6">
                  {getRankIcon(rank)}
                </div>

                <Avatar size="sm">
                  {entry.avatarUrl && (
                    <AvatarImage src={entry.avatarUrl} alt={entry.name} />
                  )}
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (You)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{entry.username}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-right">
                  {entry.streak > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-orange-500">
                      <Flame className="h-3 w-3" />
                      {entry.streak}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-semibold">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {filter === "all" ? "XP" : "XP earned"}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
