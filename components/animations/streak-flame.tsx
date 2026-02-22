"use client";

import { motion, AnimatePresence } from "motion/react";

interface StreakFlameProps {
  /** Current streak count */
  streak: number;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

/**
 * Animated streak flame with particle effects.
 * Intensity scales with streak length:
 * - 0: No flame
 * - 1-2: Small subtle flame
 * - 3-6: Medium flame with particles
 * - 7+: Large flame with multiple particles and glow
 */
export function StreakFlame({ streak, size = "md" }: StreakFlameProps) {
  if (streak === 0) return null;

  const intensity = streak >= 7 ? "high" : streak >= 3 ? "medium" : "low";
  const sizeMap = { sm: 24, md: 36, lg: 48 };
  const dim = sizeMap[size];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: dim, height: dim }}
    >
      {/* Outer glow */}
      {intensity !== "low" && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(251,146,60,0.3) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Main flame SVG */}
      <svg
        viewBox="0 0 40 40"
        className="relative z-10"
        style={{ width: dim * 0.8, height: dim * 0.8 }}
      >
        <defs>
          <linearGradient id="flame-gradient-outer" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <linearGradient id="flame-gradient-inner" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="flame-blur">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>

        {/* Outer flame */}
        <motion.path
          d="M20,4 C20,4 28,14 28,24 C28,30 24,34 20,34 C16,34 12,30 12,24 C12,14 20,4 20,4Z"
          fill="url(#flame-gradient-outer)"
          filter="url(#flame-blur)"
          animate={{
            d: [
              "M20,4 C20,4 28,14 28,24 C28,30 24,34 20,34 C16,34 12,30 12,24 C12,14 20,4 20,4Z",
              "M20,6 C20,6 30,14 29,23 C28,30 24,34 20,34 C16,34 12,30 11,23 C10,14 20,6 20,6Z",
              "M20,4 C20,4 28,14 28,24 C28,30 24,34 20,34 C16,34 12,30 12,24 C12,14 20,4 20,4Z",
            ],
          }}
          transition={{
            duration: intensity === "high" ? 0.6 : 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Inner flame (brighter core) */}
        <motion.path
          d="M20,14 C20,14 25,20 25,26 C25,30 23,33 20,33 C17,33 15,30 15,26 C15,20 20,14 20,14Z"
          fill="url(#flame-gradient-inner)"
          animate={{
            d: [
              "M20,14 C20,14 25,20 25,26 C25,30 23,33 20,33 C17,33 15,30 15,26 C15,20 20,14 20,14Z",
              "M20,16 C20,16 26,21 26,27 C25,30 23,33 20,33 C17,33 15,30 14,27 C13,21 20,16 20,16Z",
              "M20,14 C20,14 25,20 25,26 C25,30 23,33 20,33 C17,33 15,30 15,26 C15,20 20,14 20,14Z",
            ],
          }}
          transition={{
            duration: intensity === "high" ? 0.5 : 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />

        {/* Core (hottest part) */}
        {intensity !== "low" && (
          <motion.ellipse
            cx="20" cy="28" rx="3" ry="4"
            fill="#fef3c7"
            animate={{
              ry: [4, 3, 4],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </svg>

      {/* Particles */}
      <AnimatePresence>
        {intensity !== "low" && (
          <>
            {Array.from({ length: intensity === "high" ? 6 : 3 }).map((_, i) => (
              <FlameParticle key={i} index={i} dim={dim} intensity={intensity} />
            ))}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlameParticle({
  index,
  dim,
  intensity,
}: {
  index: number;
  dim: number;
  intensity: "medium" | "high";
}) {
  const xOffset = (Math.random() - 0.5) * dim * 0.6;
  const duration = 1 + Math.random() * 0.8;
  const delay = index * (intensity === "high" ? 0.3 : 0.5);
  const particleSize = 2 + Math.random() * 2;

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: particleSize,
        height: particleSize,
        bottom: "30%",
        left: "50%",
        background: index % 2 === 0 ? "#f59e0b" : "#fbbf24",
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 1 }}
      animate={{
        opacity: [0, 1, 0],
        x: [0, xOffset],
        y: [0, -dim * 0.8],
        scale: [1, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}
