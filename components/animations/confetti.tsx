"use client";

import { useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiCelebrationProps {
  /** When true, fires the confetti burst */
  trigger: boolean;
  /** Called after animation completes */
  onComplete?: () => void;
}

/**
 * Confetti celebration effect.
 * Fires a burst of confetti when `trigger` becomes true.
 * Uses canvas-confetti for performant particle effects.
 */
export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const hasFired = useRef(false);

  const fire = useCallback(() => {
    // Multi-burst celebration
    const defaults = {
      spread: 70,
      ticks: 100,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      colors: [
        "#10b981", // emerald
        "#3b82f6", // blue
        "#f59e0b", // amber
        "#8b5cf6", // violet
        "#f43f5e", // rose
        "#06b6d4", // cyan
      ],
    };

    // Left burst
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.2, y: 0.6 },
      angle: 60,
    });

    // Right burst
    confetti({
      ...defaults,
      particleCount: 40,
      origin: { x: 0.8, y: 0.6 },
      angle: 120,
    });

    // Center burst with delay
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 60,
        origin: { x: 0.5, y: 0.7 },
        spread: 90,
        startVelocity: 35,
      });
    }, 150);

    // Stars / special shapes
    setTimeout(() => {
      confetti({
        ...defaults,
        particleCount: 20,
        origin: { x: 0.5, y: 0.5 },
        spread: 120,
        startVelocity: 20,
        shapes: ["star"],
        scalar: 1.2,
      });

      onComplete?.();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    if (trigger && !hasFired.current) {
      hasFired.current = true;
      fire();
    }
    if (!trigger) {
      hasFired.current = false;
    }
  }, [trigger, fire]);

  return null; // canvas-confetti uses a global canvas
}

/**
 * Hook to fire confetti imperatively.
 * Returns a function that can be called to trigger confetti.
 */
export function useConfetti() {
  const fire = useCallback((options?: {
    particleCount?: number;
    spread?: number;
    origin?: { x: number; y: number };
  }) => {
    confetti({
      particleCount: options?.particleCount ?? 50,
      spread: options?.spread ?? 70,
      origin: options?.origin ?? { x: 0.5, y: 0.6 },
      colors: [
        "#10b981",
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#f43f5e",
      ],
      ticks: 80,
      gravity: 0.9,
      decay: 0.94,
      startVelocity: 25,
    });
  }, []);

  return fire;
}
