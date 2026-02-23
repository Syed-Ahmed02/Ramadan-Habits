"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  LogOut,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { motion } from "motion/react";
import type { Id } from "@/convex/_generated/dataModel";

interface ChallengeCardProps {
  challengeId: Id<"challenges">;
  title: string;
  description?: string;
  habitTitle?: string | null;
  startDate: string;
  endDate: string;
  creatorName: string;
  participantCount: number;
  isCreator: boolean;
  isParticipant?: boolean;
  challengeStatus?: string; // "completed" from backend
  index?: number;
  onViewDetails?: (id: Id<"challenges">) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getChallengeStatus(startDate: string, endDate: string) {
  const now = new Date().toISOString().split("T")[0];
  if (now < startDate) return "upcoming";
  if (now > endDate) return "completed";
  return "active";
}

function getDaysProgress(startDate: string, endDate: string) {
  const now = new Date();
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");
  const total = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const elapsed = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  return { elapsed: Math.min(elapsed, total), total };
}

export function ChallengeCard({
  challengeId,
  title,
  description,
  habitTitle,
  startDate,
  endDate,
  creatorName,
  participantCount,
  isCreator,
  isParticipant = true,
  challengeStatus,
  index = 0,
  onViewDetails,
}: ChallengeCardProps) {
  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const leaveChallenge = useMutation(api.challenges.leaveChallenge);
  const deleteChallenge = useMutation(api.challenges.deleteChallenge);
  const [loading, setLoading] = useState(false);

  const status = challengeStatus === "completed" ? "completed" : getChallengeStatus(startDate, endDate);
  const { elapsed, total } = getDaysProgress(startDate, endDate);

  const handleJoin = async () => {
    setLoading(true);
    try {
      await joinChallenge({ challengeId });
    } catch {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
      await leaveChallenge({ challengeId });
    } catch {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteChallenge({ challengeId });
    } catch {
      setLoading(false);
    }
  };

  const statusColors = {
    upcoming: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400",
    active: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    completed: "text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card size="sm">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className="text-sm font-semibold truncate cursor-pointer hover:underline"
                  onClick={() => onViewDetails?.(challengeId)}
                >
                  {title}
                </h3>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[status]}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              {description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {participantCount}
            </span>
            {habitTitle && (
              <span className="truncate">{habitTitle}</span>
            )}
          </div>

          {status === "active" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Day {elapsed} of {total}</span>
                <span>{Math.round((elapsed / total) * 100)}%</span>
              </div>
              <Progress value={(elapsed / total) * 100} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              by {isCreator ? "you" : creatorName}
            </span>

            <div className="flex items-center gap-1">
              {!isParticipant && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleJoin}
                  disabled={loading}
                  className="text-xs h-7"
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Join
                </Button>
              )}
              {isParticipant && !isCreator && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLeave}
                  disabled={loading}
                  className="text-xs h-7 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Leave
                </Button>
              )}
              {isCreator && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-xs h-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
