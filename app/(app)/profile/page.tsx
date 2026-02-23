"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getLevelProgress, formatXp } from "@/lib/gamification";
import { BADGE_DEFINITIONS, type BadgeType } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import {
  Star,
  Flame,
  Trophy,
  Target,
  Calendar,
  LucideProps,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

function getIcon(iconName: string): React.ComponentType<LucideProps> | null {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
  return icons[iconName] || null;
}

export default function ProfilePage() {
  const user = useQuery(api.users.getCurrentUser);
  const badges = useQuery(api.badges.getUserBadges);

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="h-40 rounded-xl bg-muted animate-pulse" />
        <div className="h-60 rounded-xl bg-muted animate-pulse" />
      </div>
    );
  }

  const { level, currentLevelXp, nextLevelXp, percentage } = getLevelProgress(user.xp);
  const earnedBadgeTypes = new Set(badges?.map((b) => b.badgeType) ?? []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your stats and achievements
        </p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="rounded-xl border border-border bg-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start gap-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "h-16 w-16",
              },
            }}
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary" />
              <span className="font-medium">Level {level}</span>
            </div>
            <span className="text-muted-foreground">
              {formatXp(currentLevelXp)} / {formatXp(nextLevelXp)} XP
            </span>
          </div>
          <Progress value={percentage} className="h-2.5" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <StatCard
            icon={<Star className="h-4 w-4 text-primary" />}
            label="Total XP"
            value={formatXp(user.xp)}
          />
          <StatCard
            icon={<Trophy className="h-4 w-4 text-amber-500" />}
            label="Level"
            value={level.toString()}
          />
          <StatCard
            icon={<Flame className="h-4 w-4 text-orange-500" />}
            label="Current Streak"
            value={`${user.streak} days`}
          />
          <StatCard
            icon={<Target className="h-4 w-4 text-blue-500" />}
            label="Best Streak"
            value={`${user.longestStreak} days`}
          />
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        className="rounded-xl border border-border bg-card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-base font-semibold">Badges</h3>
          <span className="text-xs text-muted-foreground">
            {earnedBadgeTypes.size}/{Object.keys(BADGE_DEFINITIONS).length} earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.entries(BADGE_DEFINITIONS) as [BadgeType, typeof BADGE_DEFINITIONS[BadgeType]][]).map(
            ([type, badge]) => {
              const isEarned = earnedBadgeTypes.has(type);
              const BadgeIcon = getIcon(badge.icon);

              return (
                <motion.div
                  key={type}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-colors",
                    isEarned
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-muted/30 opacity-50"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full",
                      isEarned
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                  >
                    {BadgeIcon && (
                      <BadgeIcon
                        className={cn(
                          "h-5 w-5",
                          isEarned ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-medium">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </motion.div>
              );
            }
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3 text-center">
      {icon}
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
