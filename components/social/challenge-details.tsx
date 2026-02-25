"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Calendar, Trophy, Medal, Award, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

interface ChallengeDetailsProps {
  challengeId: Id<"challenges">;
  onBack: () => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function ChallengeDetails({ challengeId, onBack }: ChallengeDetailsProps) {
  const details = useQuery(api.challenges.getChallengeDetails, { challengeId });
  const completeChallenge = useMutation(api.challenges.completeChallenge);
  const [completing, setCompleting] = useState(false);

  if (details === undefined) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="space-y-4">
          <div className="h-8 w-full rounded-lg bg-muted animate-pulse" />
          <div className="h-24 rounded-xl bg-muted animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="text-sm text-muted-foreground text-center py-8">
          Challenge not found
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-4 w-4 text-yellow-500" />;
    if (rank === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 2) return <Award className="h-4 w-4 text-amber-700" />;
    return (
      <span className="text-xs font-medium text-muted-foreground w-4 text-center">
        {rank + 1}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Challenges
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{details.title}</h1>
        {details.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {details.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(details.startDate)} - {formatDate(details.endDate)}
          </span>
          {details.habitTitle && <span>Habit: {details.habitTitle}</span>}
          <span>Created by {details.creatorName}</span>
        </div>

        {/* Challenge status / complete button */}
        {details.status === "completed" ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 px-3 py-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">Challenge Completed</span>
            <Sparkles className="h-3 w-3 ml-1" />
            <span className="text-xs opacity-70">+50 XP awarded</span>
          </div>
        ) : details.isCreator ? (
          <div className="mt-3">
            <Button
              size="sm"
              onClick={async () => {
                setCompleting(true);
                try {
                  await completeChallenge({ challengeId });
                } catch (err) {
                  console.error("Failed to complete challenge:", err);
                } finally {
                  setCompleting(false);
                }
              }}
              disabled={completing}
            >
              <Trophy className="h-4 w-4 mr-1" />
              {completing ? "Completing..." : "Complete Challenge & Award XP"}
            </Button>
          </div>
        ) : null}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Participant Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {details.participants.map((participant, rank) => {
                const initials = participant.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <motion.div
                    key={participant.clerkId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex items-center justify-center w-6">
                      {getRankIcon(rank)}
                    </div>

                    <Avatar size="sm">
                      {participant.avatarUrl && (
                        <AvatarImage
                          src={participant.avatarUrl}
                          alt={participant.name}
                        />
                      )}
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {participant.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {participant.completedDays}/{participant.totalDays} days
                        </span>
                      </div>
                      <Progress value={participant.percentage} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
