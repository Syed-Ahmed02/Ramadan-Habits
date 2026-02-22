"use client";

import { motion, AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";

interface XpPopupProps {
  /** XP amount to display, null = hidden */
  xp: number | null;
  /** Position relative to the trigger element */
  position?: { x: number; y: number };
}

/**
 * Floating XP popup that appears when XP is earned.
 * Shows "+N XP" floating upward and fading out.
 */
export function XpPopup({ xp, position }: XpPopupProps) {
  return (
    <AnimatePresence>
      {xp !== null && (
        <motion.div
          className="fixed z-[80] flex items-center gap-1 pointer-events-none"
          style={{
            left: position?.x ?? "50%",
            top: position?.y ?? "50%",
          }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -70, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center gap-1 rounded-full bg-primary/90 px-3 py-1.5 shadow-lg shadow-primary/20">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" fill="currentColor" />
            <span className="text-sm font-bold text-primary-foreground tabular-nums">
              +{xp} XP
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Inline XP popup that floats from within a component.
 * Used inside the habit checklist for per-habit XP feedback.
 */
export function InlineXpPopup({ xp, show }: { xp: number; show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          className="absolute -top-2 right-0 flex items-center gap-0.5 text-xs font-bold text-primary pointer-events-none"
          initial={{ opacity: 0, y: 4, scale: 0.7 }}
          animate={{ opacity: 1, y: -12, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.8 }}
          transition={{ duration: 0.6 }}
        >
          <Zap className="h-3 w-3" fill="currentColor" />
          +{xp}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
