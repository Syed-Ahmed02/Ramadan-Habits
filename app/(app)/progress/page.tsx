"use client";

import { motion } from "motion/react";
import { RamadanCalendar } from "@/components/progress/ramadan-calendar";

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

      <motion.section
        className="space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold">30-Day Calendar</h2>
        <RamadanCalendar />
      </motion.section>
    </div>
  );
}
