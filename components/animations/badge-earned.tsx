"use client";

import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { type LucideProps } from "lucide-react";
import { BADGE_DEFINITIONS, type BadgeType } from "@/lib/constants";
import { useEffect } from "react";

interface BadgeEarnedProps {
  /** The badge type earned, or null if none */
  badgeType: BadgeType | null;
  /** Called when the animation should be dismissed */
  onDismiss: () => void;
}

function getIcon(iconName: string): React.ComponentType<LucideProps> | null {
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
  return icons[iconName] || null;
}

/**
 * Badge earned animation overlay.
 * Shows a badge flying in from below with a shimmer effect.
 * Auto-dismisses after 3 seconds.
 */
export function BadgeEarned({ badgeType, onDismiss }: BadgeEarnedProps) {
  useEffect(() => {
    if (badgeType) {
      const timer = setTimeout(onDismiss, 3500);
      return () => clearTimeout(timer);
    }
  }, [badgeType, onDismiss]);

  const badge = badgeType ? BADGE_DEFINITIONS[badgeType] : null;
  const BadgeIcon = badge ? getIcon(badge.icon) : null;

  return (
    <AnimatePresence>
      {badge && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Semi-transparent backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
          />

          {/* Badge container */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 pointer-events-auto"
            initial={{ y: 200, opacity: 0, scale: 0.3, rotate: -20 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
            exit={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{
              type: "spring",
              bounce: 0.45,
              duration: 0.9,
            }}
            onClick={onDismiss}
          >
            {/* "Badge Earned" text */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-amber-400">
                Badge Earned
              </span>
            </motion.div>

            {/* Badge circle with shimmer */}
            <div className="relative">
              {/* Shimmer ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ margin: -8 }}
                animate={{
                  boxShadow: [
                    "0 0 15px 3px rgba(251,191,36,0.3)",
                    "0 0 25px 8px rgba(251,191,36,0.5)",
                    "0 0 15px 3px rgba(251,191,36,0.3)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              {/* Rotating shimmer highlight */}
              <motion.div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{ margin: -4 }}
              >
                <motion.div
                  className="absolute w-full h-full"
                  style={{
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(251,191,36,0.4) 10%, transparent 20%)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>

              {/* Badge circle */}
              <motion.div
                className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/30 backdrop-blur-sm">
                  {BadgeIcon && (
                    <BadgeIcon className="h-10 w-10 text-white" />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Badge name */}
            <motion.div
              className="text-center"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xl font-bold text-white">{badge.name}</p>
              <p className="text-sm text-white/60 mt-1">{badge.description}</p>
            </motion.div>

            {/* Tap to continue */}
            <motion.p
              className="text-xs text-white/40 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Tap to continue
            </motion.p>
          </motion.div>

          {/* Sparkle particles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <SparkleParticle key={i} index={i} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SparkleParticle({ index }: { index: number }) {
  const angle = (index / 8) * 360;
  const distance = 80 + Math.random() * 60;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full bg-amber-400"
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{
        x,
        y,
        opacity: [0, 1, 0],
        scale: [0, 1.5, 0],
      }}
      transition={{
        duration: 1.2,
        delay: 0.5 + index * 0.1,
        ease: "easeOut",
      }}
    />
  );
}
