"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  Trophy,
  Users,
  Flame,
  Star,
  Moon,
  Heart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

/* ────────────────────────────────────────────
   Animation variants
   ──────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

/* ────────────────────────────────────────────
   Data
   ──────────────────────────────────────────── */

const features = [
  {
    icon: CheckCircle2,
    title: "Track Daily Good Deeds",
    description:
      "Log prayers, Quran recitation, dhikr, charity, and more. Choose from 25+ predefined Ramadan habits or create your own.",
  },
  {
    icon: Trophy,
    title: "Earn XP & Level Up",
    description:
      "Every good deed earns experience points. Rise through 30 levels -- one for each blessed day of Ramadan.",
  },
  {
    icon: Flame,
    title: "Build Streaks",
    description:
      "Maintain consistency and watch your streak grow. Hit milestones at 3, 7, 14, and 30 days for bonus rewards.",
  },
  {
    icon: Users,
    title: "Compete With Friends",
    description:
      "Add friends, climb the leaderboard, and challenge each other to group goals throughout the month.",
  },
  {
    icon: Star,
    title: "Collect Badges",
    description:
      "Unlock achievements like Ramadan Champion, Quran Khatm, and Charity Champion as you progress.",
  },
  {
    icon: TrendingUp,
    title: "Watch Your Mosque Rise",
    description:
      "A mosque illustration builds piece by piece as you complete daily habits -- fully illuminated by day 30.",
  },
];

const habitCategories = [
  {
    name: "Prayer",
    icon: Moon,
    habits: ["5 Daily Prayers", "Taraweeh", "Tahajjud", "Duha Prayer"],
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  },
  {
    name: "Quran",
    icon: BookOpen,
    habits: ["Read 1 Juz", "Memorize an Ayah", "Listen to Tafsir"],
    color: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    name: "Dhikr",
    icon: Heart,
    habits: ["Morning Adhkar", "Evening Adhkar", "100x SubhanAllah"],
    color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    name: "Charity",
    icon: Sparkles,
    habits: ["Daily Sadaqah", "Feed Someone Iftar", "Help a Neighbor"],
    color: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  },
];

/* ────────────────────────────────────────────
   Components
   ──────────────────────────────────────────── */

function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl"
    >
      <nav className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-6 py-3 shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Moon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Ramadan Habits
          </span>
        </div>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton>
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button size="sm" className="cursor-pointer">
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className={buttonVariants({ size: "sm", className: "cursor-pointer" })}>Dashboard</a>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </motion.header>
  );
}

function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-3xl"
        />

        {/* Floating stars */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute text-primary/30"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + i * 18}%`,
            }}
          >
            <Star className="h-4 w-4" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm font-medium"
          >
            <Moon className="h-3.5 w-3.5" />
            Ramadan 2026 is here
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="mb-6 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
        >
          Make Every Good Deed
          <br />
          <span className="text-primary">Count This Ramadan</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          Track your daily ibadah, build unbreakable streaks, earn rewards, and
          grow alongside friends. Turn this blessed month into your most
          consistent Ramadan yet.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <SignedOut>
            <SignUpButton>
              <Button size="lg" className="cursor-pointer gap-2 px-8 text-base">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button
                variant="outline"
                size="lg"
                className="cursor-pointer px-8 text-base"
              >
                I Already Have an Account
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <a href="/dashboard" className={buttonVariants({ size: "lg", className: "cursor-pointer gap-2 px-8 text-base" })}>
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </a>
          </SignedIn>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>30 Days of Growth</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>25+ Habits to Track</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-1.5">
            <Trophy className="h-4 w-4" />
            <span>Gamified Experience</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function QuranVerseSection() {
  return (
    <section className="relative overflow-hidden bg-primary/5 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <Badge variant="outline" className="mb-8 gap-1.5 px-4 py-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Divine Inspiration
          </Badge>
        </motion.div>

        <motion.blockquote
          variants={fadeUp}
          custom={1}
          className="mb-4 font-serif text-3xl font-medium leading-relaxed tracking-tight sm:text-4xl"
        >
          &ldquo;So compete with one another in doing good.&rdquo;
        </motion.blockquote>

        <motion.p
          variants={fadeUp}
          custom={2}
          className="mb-16 text-lg text-muted-foreground"
        >
          -- Quran 2:148
        </motion.p>

        <motion.div variants={fadeUp} custom={3}>
          <Separator className="mx-auto mb-16 max-w-xs" />
        </motion.div>

        <motion.blockquote
          variants={fadeUp}
          custom={4}
          className="mb-4 font-serif text-2xl font-medium leading-relaxed tracking-tight sm:text-3xl"
        >
          &ldquo;The most beloved deed to Allah is the most regular and constant
          even if it were little.&rdquo;
        </motion.blockquote>

        <motion.p
          variants={fadeUp}
          custom={5}
          className="text-lg text-muted-foreground"
        >
          -- Sahih al-Bukhari 6464
        </motion.p>

        <motion.p
          variants={fadeUp}
          custom={6}
          className="mt-10 mx-auto max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          Ramadan Habits is built on this principle -- small, consistent actions
          compounding into transformative spiritual growth over 30 days.
        </motion.p>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="secondary" className="mb-4 gap-1.5 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Features
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything You Need for a Productive Ramadan
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Built specifically for the blessed month -- every feature is
            designed to help you stay consistent, motivated, and connected.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div key={feature.title} variants={scaleIn} custom={i}>
              <Card className="group h-full cursor-pointer border-border/60 transition-colors duration-200 hover:border-primary/30 hover:bg-accent/50">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HabitsPreviewSection() {
  return (
    <section className="bg-muted/50 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="secondary" className="mb-4 gap-1.5 px-4 py-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Habits Library
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Curated for the Blessed Month
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Start with over 25 predefined Ramadan-specific habits across
            prayer, Quran, dhikr, and charity -- or add your own.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {habitCategories.map((category, i) => (
            <motion.div key={category.name} variants={scaleIn} custom={i}>
              <Card className="h-full border-border/60">
                <CardContent className="p-6">
                  <div
                    className={`mb-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${category.color}`}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </div>
                  <ul className="space-y-2.5">
                    {category.habits.map((habit) => (
                      <li
                        key={habit}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                        {habit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Sign up & pick your habits",
      description:
        "Create your account, choose from predefined Ramadan habits or add your own daily goals.",
    },
    {
      step: "02",
      title: "Complete your daily checklist",
      description:
        "Each day, mark off your good deeds. Watch your XP climb and your streak grow with every check.",
    },
    {
      step: "03",
      title: "Level up & compete",
      description:
        "Earn badges, climb the leaderboard, challenge friends, and watch your mosque build day by day.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="secondary" className="mb-4 gap-1.5 px-4 py-1.5">
              <ArrowRight className="h-3.5 w-3.5" />
              How It Works
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Three Steps to Your Best Ramadan
          </motion.h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={fadeUp}
              custom={i}
              className="relative text-center"
            >
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground">
                {step.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="pointer-events-none absolute top-7 right-0 hidden w-1/2 translate-x-1/2 md:block">
                  <Separator className="border-dashed" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function RamadanCountdownSection() {
  return (
    <section className="relative overflow-hidden bg-primary py-24 px-6">
      <div className="pointer-events-none absolute inset-0">
        {/* Decorative crescent and stars */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-12 text-primary-foreground/10"
        >
          <Moon className="h-32 w-32" />
        </motion.div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
            className="absolute text-primary-foreground/15"
            style={{
              top: `${Math.random() * 80 + 10}%`,
              left: `${Math.random() * 90 + 5}%`,
            }}
          >
            <Star className="h-3 w-3" />
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-3xl text-center text-primary-foreground"
      >
        <motion.h2
          variants={fadeUp}
          custom={0}
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Ramadan Mubarak
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          className="mb-4 text-lg opacity-90"
        >
          The blessed month is upon us. Every moment is an opportunity to draw
          closer to Allah, strengthen your habits, and transform your character.
        </motion.p>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mb-10 text-base opacity-75"
        >
          Whether it is your first Ramadan tracking journey or your tenth,
          Ramadan Habits helps you stay consistent from Suhoor to Iftar, and
          from the first Taraweeh to the last.
        </motion.p>
        <motion.div variants={fadeUp} custom={3}>
          <SignedOut>
            <SignUpButton>
              <Button
                size="lg"
                variant="secondary"
                className="cursor-pointer gap-2 px-8 text-base font-semibold"
              >
                Begin This Ramadan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a
              href="/dashboard"
              className={buttonVariants({ size: "lg", variant: "secondary", className: "cursor-pointer gap-2 px-8 text-base font-semibold" })}
            >
                Continue Your Journey
                <ArrowRight className="h-4 w-4" />
              </a>
          </SignedIn>
        </motion.div>
      </motion.div>
    </section>
  );
}

function GamificationSection() {
  const badges = [
    { name: "First Step", condition: "Complete your first habit" },
    { name: "Consistent", condition: "7-day streak" },
    { name: "Halfway There", condition: "15-day streak" },
    { name: "Ramadan Champion", condition: "30-day streak" },
    { name: "Quran Khatm", condition: "Complete 30 Juz" },
    { name: "Night Owl", condition: "10 Tahajjud prayers" },
  ];

  return (
    <section className="bg-muted/50 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <Badge variant="secondary" className="mb-4 gap-1.5 px-4 py-1.5">
              <Trophy className="h-3.5 w-3.5" />
              Gamification
            </Badge>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            custom={1}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Stay Motivated All Month Long
          </motion.h2>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Earn XP, unlock badges, and watch your progress come to life. Every
            good deed brings you closer to your goals.
          </motion.p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* XP & Levels */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
          >
            <Card className="h-full border-border/60">
              <CardContent className="p-8">
                <h3 className="mb-6 text-xl font-semibold">XP & Levels</h3>
                <div className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium">Level 12</span>
                      <span className="text-muted-foreground">1200 / 1300 XP</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "92%" }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <p className="text-2xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">Level</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <p className="text-2xl font-bold">1200</p>
                      <p className="text-xs text-muted-foreground">Total XP</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="h-5 w-5 text-orange-500" />
                        <p className="text-2xl font-bold">14</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Badges */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
          >
            <Card className="h-full border-border/60">
              <CardContent className="p-8">
                <h3 className="mb-6 text-xl font-semibold">Badges to Earn</h3>
                <div className="grid grid-cols-2 gap-3">
                  {badges.map((badge, i) => (
                    <motion.div
                      key={badge.name}
                      variants={fadeIn}
                      custom={i}
                      className="flex items-start gap-3 rounded-xl bg-muted p-3"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {badge.condition}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FinalCTASection() {
  return (
    <section className="py-24 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.div variants={fadeUp} custom={0}>
          <Moon className="mx-auto mb-6 h-12 w-12 text-primary" />
        </motion.div>
        <motion.h2
          variants={fadeUp}
          custom={1}
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Your Best Ramadan Starts Now
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={2}
          className="mb-10 text-lg text-muted-foreground"
        >
          Join a community striving to make every day of this blessed month
          count. Track, grow, and compete -- all for the sake of Allah.
        </motion.p>
        <motion.div
          variants={fadeUp}
          custom={3}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <SignedOut>
            <SignUpButton>
              <Button
                size="lg"
                className="cursor-pointer gap-2 px-8 text-base"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <a
              href="/dashboard"
              className={buttonVariants({ size: "lg", className: "cursor-pointer gap-2 px-8 text-base" })}
            >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </a>
          </SignedIn>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <motion.footer
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="border-t border-border/60 py-8 px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Moon className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold">Ramadan Habits</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Built with sincerity for the Muslim ummah. May Allah accept our
          efforts.
        </p>
      </div>
    </motion.footer>
  );
}

/* ────────────────────────────────────────────
   Page
   ──────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <QuranVerseSection />
      <FeaturesSection />
      <HabitsPreviewSection />
      <HowItWorksSection />
      <RamadanCountdownSection />
      <GamificationSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
