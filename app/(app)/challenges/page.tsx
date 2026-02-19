"use client";

import { motion } from "motion/react";
import { Swords } from "lucide-react";

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Challenges</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create and join group challenges
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
          <Swords className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-base font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Challenge your friends to complete habits together.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
