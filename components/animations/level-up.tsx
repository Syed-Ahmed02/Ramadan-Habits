"use client";

import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronUp } from "lucide-react";
import { useEffect } from "react";

interface LevelUpOverlayProps {
  /** Whether to show the overlay */
  show: boolean;
  /** The new level reached */
  newLevel: number;
  /** Called when the overlay should be dismissed */
  onDismiss: () => void;
}

/**
 * Full-screen level-up celebration overlay.
 * Shows a dramatic reveal of the new level with stars and particle effects.
 * Auto-dismisses after 3 seconds or on click.
 */
export function LevelUpOverlay({ show, newLevel, onDismiss }: LevelUpOverlayProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onDismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Radiating rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-primary/20"
              initial={{ width: 0, height: 0, opacity: 0.6 }}
              animate={{
                width: [0, 400 + i * 100],
                height: [0, 400 + i * 100],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.3 + i * 0.2,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Main content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8, delay: 0.1 }}
          >
            {/* Level up text */}
            <motion.div
              className="flex items-center gap-1.5 text-primary"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ChevronUp className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">
                Level Up
              </span>
              <ChevronUp className="h-5 w-5" />
            </motion.div>

            {/* Level badge */}
            <motion.div
              className="relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                bounce: 0.5,
                duration: 1,
                delay: 0.2,
              }}
            >
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.2, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ margin: -12 }}
              />

              {/* Badge circle */}
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30">
                <div className="flex items-center justify-center w-24 h-24 rounded-full bg-background/10 backdrop-blur-sm">
                  <div className="flex flex-col items-center">
                    <Star className="h-6 w-6 text-primary-foreground mb-1" />
                    <span className="text-3xl font-bold text-primary-foreground tabular-nums">
                      {newLevel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Congratulations text */}
            <motion.p
              className="text-lg font-semibold text-white"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Level {newLevel} Reached!
            </motion.p>

            <motion.p
              className="text-sm text-white/60"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Tap anywhere to continue
            </motion.p>
          </motion.div>

          {/* Floating stars */}
          {Array.from({ length: 12 }).map((_, i) => (
            <FloatingStar key={i} index={i} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingStar({ index }: { index: number }) {
  const angle = (index / 12) * 360;
  const distance = 120 + Math.random() * 80;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;
  const size = 8 + Math.random() * 12;

  return (
    <motion.div
      className="absolute"
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 0],
        scale: [0, 1, 0.5],
        rotate: [0, 180],
      }}
      transition={{
        duration: 1.5 + Math.random() * 0.5,
        delay: 0.4 + index * 0.08,
        ease: "easeOut",
      }}
    >
      <Star
        className="text-primary/70"
        style={{ width: size, height: size }}
        fill="currentColor"
      />
    </motion.div>
  );
}
