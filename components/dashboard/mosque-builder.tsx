"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getTodayDateString, getDailyCompletionPercentage } from "@/lib/gamification";
import { motion } from "motion/react";

/**
 * Mosque Builder - A progressive SVG mosque that builds up as habits are completed.
 * The mosque starts as an outline and fills in as the user completes habits.
 * Elements appear in order: foundation -> walls -> windows -> door -> minarets -> dome -> crescent -> lanterns -> glow
 */
export function MosqueBuilder() {
  const today = getTodayDateString();
  const stats = useQuery(api.habitLogs.getTodayStats, { date: today });

  if (!stats) {
    return (
      <div className="h-64 rounded-xl bg-muted animate-pulse" />
    );
  }

  const percentage = getDailyCompletionPercentage(stats.completed, stats.total);

  return (
    <div className="rounded-xl border border-border bg-card p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Mosque Progress</h3>
        <span className="text-xs text-muted-foreground">
          {percentage}% complete
        </span>
      </div>
      <MosqueSVG percentage={percentage} />
    </div>
  );
}

function MosqueSVG({ percentage }: { percentage: number }) {
  // Thresholds for each building stage
  const hasFoundation = percentage >= 0;
  const hasWalls = percentage >= 10;
  const hasWindows = percentage >= 25;
  const hasDoor = percentage >= 35;
  const hasMinarets = percentage >= 50;
  const hasDome = percentage >= 60;
  const hasCrescent = percentage >= 75;
  const hasLanterns = percentage >= 85;
  const isGlowing = percentage >= 100;

  const fadeIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" as const },
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const },
  };

  return (
    <div className="flex justify-center items-end" style={{ minHeight: 220 }}>
      <svg
        viewBox="0 0 320 240"
        className="w-full max-w-sm"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glow filter for 100% completion */}
          <filter id="mosque-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="oklch(0.85 0.17 160)" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glowColor" />
            <feMerge>
              <feMergeNode in="glowColor" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Warm light gradient */}
          <radialGradient id="warm-light" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="oklch(0.92 0.13 85)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.92 0.13 85)" stopOpacity="0" />
          </radialGradient>

          {/* Sky gradient */}
          <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.35 0.08 260)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="oklch(0.35 0.08 260)" stopOpacity="0" />
          </linearGradient>

          {/* Window glow */}
          <radialGradient id="window-glow">
            <stop offset="0%" stopColor="oklch(0.90 0.15 85)" />
            <stop offset="100%" stopColor="oklch(0.75 0.12 70)" />
          </radialGradient>

          {/* Lantern glow */}
          <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.90 0.16 80)" stopOpacity="0.9" />
            <stop offset="70%" stopColor="oklch(0.80 0.14 60)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.80 0.14 60)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background sky hint */}
        <rect x="0" y="0" width="320" height="240" fill="url(#sky-gradient)" rx="8" />

        {/* Ground line */}
        <line
          x1="20" y1="220" x2="300" y2="220"
          className="stroke-border"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <g filter={isGlowing ? "url(#mosque-glow)" : undefined}>
          {/* Foundation */}
          {hasFoundation && (
            <motion.g {...slideUp} transition={{ ...slideUp.transition, delay: 0 }}>
              <rect
                x="80" y="210" width="160" height="10" rx="2"
                className="fill-muted-foreground/20 stroke-muted-foreground/40"
                strokeWidth="1"
              />
              {/* Foundation stones */}
              <line x1="120" y1="210" x2="120" y2="220" className="stroke-muted-foreground/20" strokeWidth="0.5" />
              <line x1="160" y1="210" x2="160" y2="220" className="stroke-muted-foreground/20" strokeWidth="0.5" />
              <line x1="200" y1="210" x2="200" y2="220" className="stroke-muted-foreground/20" strokeWidth="0.5" />
            </motion.g>
          )}

          {/* Walls */}
          {hasWalls && (
            <motion.g {...slideUp} transition={{ ...slideUp.transition, delay: 0.1 }}>
              <rect
                x="90" y="140" width="140" height="70" rx="2"
                className="fill-card stroke-foreground/30"
                strokeWidth="1.5"
              />
              {/* Brick pattern hints */}
              {[0, 1, 2, 3].map((row) => (
                <line
                  key={`brick-${row}`}
                  x1="90" y1={155 + row * 15}
                  x2="230" y2={155 + row * 15}
                  className="stroke-foreground/5"
                  strokeWidth="0.5"
                />
              ))}
            </motion.g>
          )}

          {/* Windows */}
          {hasWindows && (
            <motion.g {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.2 }}>
              {/* Left window */}
              <rect x="105" y="155" width="18" height="28" rx="9"
                fill={isGlowing ? "url(#window-glow)" : "none"}
                className={isGlowing ? "" : "stroke-foreground/30"}
                strokeWidth="1"
              />
              {/* Center window (larger) */}
              <rect x="148" y="150" width="24" height="35" rx="12"
                fill={isGlowing ? "url(#window-glow)" : "none"}
                className={isGlowing ? "" : "stroke-foreground/30"}
                strokeWidth="1"
              />
              {/* Right window */}
              <rect x="197" y="155" width="18" height="28" rx="9"
                fill={isGlowing ? "url(#window-glow)" : "none"}
                className={isGlowing ? "" : "stroke-foreground/30"}
                strokeWidth="1"
              />
            </motion.g>
          )}

          {/* Door */}
          {hasDoor && (
            <motion.g {...slideUp} transition={{ ...slideUp.transition, delay: 0.3 }}>
              <rect x="145" y="190" width="30" height="20" rx="15"
                className="fill-foreground/10 stroke-foreground/30"
                strokeWidth="1"
              />
              {/* Door handle */}
              <circle cx="168" cy="202" r="1.5" className="fill-foreground/40" />
            </motion.g>
          )}

          {/* Left Minaret */}
          {hasMinarets && (
            <motion.g {...slideUp} transition={{ ...slideUp.transition, delay: 0.4 }}>
              {/* Left minaret */}
              <rect x="70" y="100" width="16" height="120" rx="2"
                className="fill-card stroke-foreground/30"
                strokeWidth="1"
              />
              {/* Left minaret cap */}
              <polygon points="66,100 78,75 90,100"
                className="fill-card stroke-foreground/30"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              {/* Left minaret balcony */}
              <rect x="66" y="135" width="24" height="4" rx="1"
                className="fill-muted-foreground/15 stroke-foreground/20"
                strokeWidth="0.5"
              />
              {/* Left minaret crescent */}
              <circle cx="78" cy="70" r="3"
                className="fill-primary/60"
              />

              {/* Right minaret */}
              <rect x="234" y="100" width="16" height="120" rx="2"
                className="fill-card stroke-foreground/30"
                strokeWidth="1"
              />
              {/* Right minaret cap */}
              <polygon points="230,100 242,75 254,100"
                className="fill-card stroke-foreground/30"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              {/* Right minaret balcony */}
              <rect x="230" y="135" width="24" height="4" rx="1"
                className="fill-muted-foreground/15 stroke-foreground/20"
                strokeWidth="0.5"
              />
              {/* Right minaret crescent */}
              <circle cx="242" cy="70" r="3"
                className="fill-primary/60"
              />
            </motion.g>
          )}

          {/* Dome */}
          {hasDome && (
            <motion.g {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.5 }}>
              {/* Main dome */}
              <ellipse cx="160" cy="140" rx="50" ry="45"
                className="fill-card stroke-foreground/30"
                strokeWidth="1.5"
              />
              {/* Dome base */}
              <rect x="110" y="135" width="100" height="8" rx="1"
                className="fill-card stroke-foreground/20"
                strokeWidth="0.5"
              />
              {/* Dome decorative ring */}
              <ellipse cx="160" cy="115" rx="20" ry="3"
                className="stroke-foreground/10"
                fill="none"
                strokeWidth="0.5"
              />
            </motion.g>
          )}

          {/* Crescent on top */}
          {hasCrescent && (
            <motion.g
              initial={{ opacity: 0, y: -15, scale: 0 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6, type: "spring", bounce: 0.4 }}
            >
              {/* Pole */}
              <line x1="160" y1="96" x2="160" y2="80"
                className="stroke-primary"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Crescent moon */}
              <path
                d="M154,72 A8,8 0 1,1 154,88 A6,6 0 1,0 154,72"
                className="fill-primary"
              />
              {/* Star */}
              <circle cx="164" cy="76" r="2" className="fill-primary" />
            </motion.g>
          )}
        </g>

        {/* Lanterns */}
        {hasLanterns && (
          <motion.g {...fadeIn} transition={{ ...fadeIn.transition, delay: 0.7 }}>
            {/* Left lantern */}
            <Lantern x={40} y={90} delay={0} isGlowing={isGlowing} />
            {/* Right lantern */}
            <Lantern x={265} y={95} delay={0.3} isGlowing={isGlowing} />
            {/* Far left lantern */}
            <Lantern x={15} y={110} delay={0.6} isGlowing={isGlowing} small />
            {/* Far right lantern */}
            <Lantern x={290} y={105} delay={0.9} isGlowing={isGlowing} small />
          </motion.g>
        )}

        {/* Glow effect when 100% */}
        {isGlowing && (
          <motion.rect
            x="70" y="60" width="180" height="170" rx="8"
            fill="url(#warm-light)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.5, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Stars when at high completion */}
        {percentage >= 85 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <Star cx={30} cy={35} delay={0} />
            <Star cx={55} cy={20} delay={0.5} />
            <Star cx={270} cy={25} delay={0.3} />
            <Star cx={295} cy={40} delay={0.8} />
            <Star cx={160} cy={15} delay={1.0} />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

function Lantern({
  x,
  y,
  delay,
  isGlowing,
  small,
}: {
  x: number;
  y: number;
  delay: number;
  isGlowing: boolean;
  small?: boolean;
}) {
  const scale = small ? 0.7 : 1;
  const w = 12 * scale;
  const h = 20 * scale;

  return (
    <motion.g
      initial={{ opacity: 0, y: y - 15 }}
      animate={{ opacity: 1, y }}
      transition={{ duration: 0.5, delay: 0.7 + delay * 0.2 }}
    >
      {/* Chain */}
      <line
        x1={x + w / 2} y1={y - h * 0.3}
        x2={x + w / 2} y2={y}
        className="stroke-foreground/20"
        strokeWidth="0.5"
      />
      {/* Lantern body */}
      <rect
        x={x} y={y}
        width={w} height={h}
        rx={w * 0.15}
        className="stroke-primary/60"
        strokeWidth="0.8"
        fill={isGlowing ? "url(#lantern-glow)" : "none"}
      />
      {/* Lantern top */}
      <polygon
        points={`${x},${y} ${x + w / 2},${y - h * 0.25} ${x + w},${y}`}
        className="fill-primary/20 stroke-primary/50"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Lantern bottom */}
      <polygon
        points={`${x},${y + h} ${x + w / 2},${y + h + h * 0.15} ${x + w},${y + h}`}
        className="fill-primary/20 stroke-primary/50"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Lantern cross bars */}
      <line x1={x} y1={y + h * 0.33} x2={x + w} y2={y + h * 0.33}
        className="stroke-primary/30" strokeWidth="0.3" />
      <line x1={x} y1={y + h * 0.66} x2={x + w} y2={y + h * 0.66}
        className="stroke-primary/30" strokeWidth="0.3" />
      {/* Glow circle */}
      {isGlowing && (
        <motion.circle
          cx={x + w / 2} cy={y + h / 2}
          r={w}
          fill="url(#lantern-glow)"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: delay * 0.5 }}
        />
      )}
    </motion.g>
  );
}

function Star({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <motion.circle
      cx={cx} cy={cy} r={1.2}
      className="fill-primary/60"
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 2 + delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
