"use client";

import { motion } from "motion/react";
import { BarChart3 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your 30-day Ramadan journey
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-12 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
          <BarChart3 className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-base font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-1">
            30-day calendar view, charts, and detailed statistics will be available here.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
