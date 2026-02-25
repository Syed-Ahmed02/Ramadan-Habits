"use client";

import { useRef, useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Star, Flame } from "lucide-react";
import { toPng } from "html-to-image";
import { motion } from "motion/react";
import { getTodayDateString } from "@/lib/gamification";

export function ShareCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const user = useQuery(api.users.getCurrentUser);
  const todayStats = useQuery(api.habitLogs.getTodayStats, {
    date: getTodayDateString(),
  });

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `ramadan-progress-${getTodayDateString()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
    } finally {
      setDownloading(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "ramadan-progress.png", {
        type: "image/png",
      });

      if (navigator.share) {
        await navigator.share({
          title: "My Ramadan Progress",
          text: "Check out my Ramadan habits progress!",
          files: [file],
        });
      } else {
        // Fallback to download
        handleDownload();
      }
    } catch (err) {
      console.error("Failed to share:", err);
    }
  }, [handleDownload]);

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 space-y-4">
          <div className="h-6 w-40 rounded bg-muted animate-pulse mx-auto" />
          <div className="h-48 rounded-2xl bg-muted animate-pulse max-w-[400px] mx-auto" />
          <div className="h-10 w-full rounded-lg bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const completionPercent = todayStats
    ? todayStats.total > 0
      ? Math.round((todayStats.completed / todayStats.total) * 100)
      : 0
    : 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Preview of the shareable card */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-2xl p-6"
            style={{
              background: "linear-gradient(135deg, #0c1445 0%, #1a237e 30%, #283593 60%, #1a4a2e 100%)",
              color: "white",
              width: "100%",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            {/* Islamic geometric pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg 60deg, rgba(255,255,255,0.15) 60deg 120deg)`,
                backgroundSize: "60px 60px",
              }}
            />

            {/* Star decorations */}
            <div className="absolute top-3 right-3 opacity-30">
              <Star className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="absolute top-8 right-10 opacity-20">
              <Star className="h-3 w-3 text-yellow-300" />
            </div>

            <div className="relative space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/20">
                  <Star className="w-4 h-4 text-yellow-300" />
                </div>
                <span className="text-sm font-semibold tracking-tight opacity-80">
                  Ramadan Habits
                </span>
              </div>

              {/* User info */}
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-xs opacity-60">@{user.username}</p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <p className="text-lg font-bold">{user.level}</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">
                    Level
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <p className="text-lg font-bold">{user.streak}</p>
                  </div>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">
                    Streak
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 text-center">
                  <p className="text-lg font-bold">
                    {user.xp.toLocaleString()}
                  </p>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">
                    XP
                  </p>
                </div>
              </div>

              {/* Today's progress */}
              {todayStats && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="opacity-70">Today&apos;s Progress</span>
                    <span className="font-medium">
                      {todayStats.completed}/{todayStats.total} habits
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${completionPercent}%`,
                        background:
                          "linear-gradient(90deg, #4ade80 0%, #22c55e 100%)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Date */}
              <p className="text-[10px] opacity-40 text-right">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
            >
              <Download className="h-4 w-4 mr-1" />
              {downloading ? "Generating..." : "Download PNG"}
            </Button>
            <Button size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
