# Ramadan Habits - Production Plan

## Overview

A gamified Ramadan productivity app where users track daily good deeds, earn XP, build streaks, compete with friends on leaderboards, and watch a mosque/lantern visual come to life as they complete their daily habits over 30 days.

---

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router) + React 19              |
| Backend / DB   | Convex (already configured)                     |
| Authentication | Clerk (with Convex integration)                 |
| UI Components  | shadcn/ui + Tailwind CSS v4                     |
| Animations     | Framer Motion + tw-animate-css                  |
| Icons          | Lucide React                                    |
| Fonts          | Plus Jakarta Sans (sans), Lora (serif)           |
| Package Mgr    | pnpm                                            |

---

## Database Schema (Convex)

### `users`
| Field         | Type     | Description                       |
| ------------- | -------- | --------------------------------- |
| clerkId       | string   | Clerk user ID                     |
| name          | string   | Display name                      |
| email         | string   | Email address                     |
| username      | string   | Unique username for friend search |
| avatarUrl     | string?  | Profile picture URL               |
| level         | number   | Current level (1-30)              |
| xp            | number   | Total experience points           |
| streak        | number   | Current consecutive day streak    |
| longestStreak | number   | Best streak achieved              |
| createdAt     | number   | Timestamp                         |

### `habits`
| Field       | Type     | Description                                          |
| ----------- | -------- | ---------------------------------------------------- |
| userId      | string?  | null = default/predefined habit                      |
| title       | string   | Habit name                                           |
| category    | string   | prayer/quran/dhikr/charity/character/fasting         |
| description | string?  | Optional description                                 |
| xpReward    | number   | XP earned on completion                              |
| isDefault   | boolean  | Whether it's a predefined habit                      |
| icon        | string?  | Icon name from Lucide                                |
| order       | number   | Display order                                        |

### `habitLogs`
| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| userId      | string   | Owner                          |
| habitId     | Id       | Reference to habit             |
| date        | string   | ISO date string (YYYY-MM-DD)  |
| completed   | boolean  | Whether it was done            |
| completedAt | number?  | Timestamp of completion        |

### `friendships`
| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| senderId    | string   | User who sent request          |
| receiverId  | string   | User who received request      |
| status      | string   | "pending" / "accepted"         |
| createdAt   | number   | Timestamp                      |

### `challenges`
| Field          | Type       | Description                    |
| -------------- | ---------- | ------------------------------ |
| creatorId      | string     | User who created challenge     |
| title          | string     | Challenge name                 |
| description    | string?    | Challenge description          |
| habitId        | Id?        | Linked habit (optional)        |
| startDate      | string     | Start date                     |
| endDate        | string     | End date                       |
| participantIds | string[]   | Users participating            |
| createdAt      | number     | Timestamp                      |

### `notifications`
| Field         | Type     | Description                    |
| ------------- | -------- | ------------------------------ |
| userId        | string   | Recipient                      |
| type          | string   | friend_request/challenge_invite/achievement/streak |
| message       | string   | Notification text              |
| read          | boolean  | Read status                    |
| relatedUserId | string?  | Related user (if applicable)   |
| createdAt     | number   | Timestamp                      |

### `badges`
| Field       | Type     | Description                    |
| ----------- | -------- | ------------------------------ |
| userId      | string   | Owner                          |
| badgeType   | string   | Badge identifier               |
| earnedAt    | number   | When it was earned             |

---

## Default Good Deeds (Predefined Habits)

### Prayer (xp: 15-25)
- 5 Daily Prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) - 20 XP each
- Taraweeh Prayer - 25 XP
- Tahajjud / Qiyam al-Layl - 25 XP
- Duha Prayer - 15 XP

### Quran (xp: 20-30)
- Read 1 Juz - 30 XP
- Memorize an Ayah - 25 XP
- Listen to Tafsir - 20 XP
- Recite with Tajweed - 20 XP

### Dhikr (xp: 10-15)
- Morning Adhkar - 15 XP
- Evening Adhkar - 15 XP
- 100x SubhanAllah - 10 XP
- 100x Alhamdulillah - 10 XP
- 100x Istighfar - 10 XP
- Send Salawat on the Prophet - 10 XP

### Charity (xp: 20-25)
- Give Daily Sadaqah - 25 XP
- Feed Someone Iftar - 25 XP
- Donate to a Cause - 20 XP
- Help a Neighbor - 20 XP

### Character (xp: 15-20)
- No Backbiting - 20 XP
- Smile at Others - 15 XP
- Help Someone in Need - 20 XP
- Practice Patience - 15 XP
- Make Dua for Others - 15 XP

### Fasting (xp: 20-25)
- Fast the Day - 25 XP
- Eat Suhoor - 20 XP
- Break Fast on Time - 20 XP

---

## Gamification System

### XP and Levels
- Each completed habit awards XP (10-30 based on difficulty)
- Level thresholds: Level N requires N * 100 total XP
- 30 levels total (one for each day of Ramadan)
- Level-up triggers a celebration animation

### Streaks
- A streak increments when ALL selected daily habits are completed
- Streak milestones: 3, 7, 10, 14, 21, 30 days
- Each milestone triggers a special animation and bonus XP

### Badges
| Badge              | Condition                          |
| ------------------ | ---------------------------------- |
| First Step         | Complete first habit ever          |
| Consistent         | 7-day streak                      |
| Halfway There      | 15-day streak                     |
| Ramadan Champion   | 30-day streak (full month)        |
| Quran Khatm        | Complete 30 Juz readings          |
| Charity Champion   | 30 days of sadaqah                |
| Night Owl          | 10 Tahajjud prayers               |
| Social Butterfly   | Add 5 friends                     |
| Challenge Master   | Complete 3 group challenges       |

### Leaderboard Scoring
- Ranked by total XP among friends
- Daily / Weekly / All-time views
- Top 3 get special badges on their profile

---

## App Routes and Pages

| Route              | Page                    | Description                                              |
| ------------------ | ----------------------- | -------------------------------------------------------- |
| `/`                | Landing Page            | Marketing page with app description, sign-in CTA         |
| `/sign-in`         | Sign In                 | Clerk sign-in page                                       |
| `/sign-up`         | Sign Up                 | Clerk sign-up page                                       |
| `/dashboard`       | Dashboard               | Main hub: daily checklist, XP bar, streak, mosque visual |
| `/habits`          | Habit Manager           | Browse defaults, add/edit custom habits                  |
| `/progress`        | Progress and Stats      | 30-day calendar, charts, badge showcase                  |
| `/friends`         | Friends and Leaderboard | Add friends, view leaderboard                            |
| `/challenges`      | Group Challenges        | Create/join challenges, track group progress             |
| `/profile`         | User Profile            | Settings, level badge, share card generator              |

---

## Animations and Visual Design

### Mosque/Lantern Builder (Main Progress Visual)
- A mosque illustration starts as a foundation/outline on Day 1
- Each completed habit adds visual elements:
  - Bricks/walls fill in
  - Minarets rise
  - Dome forms
  - Lanterns light up
  - Crescent moon appears at the top
- At 100% daily completion, the mosque glows with warm light
- Progressive across the 30 days - by day 30, a fully built illuminated mosque

### Celebration Animations
- Habit completion: Checkmark bounces with a glow effect
- All daily habits done: Confetti burst + mosque lights up
- Streak milestone: Fireworks/particle effects
- Level up: Full-screen overlay with stars and level badge reveal
- Badge earned: Badge flies in with shimmer effect

### UI Micro-interactions
- Cards slide in on page load (staggered)
- XP bar fills smoothly with easing
- Progress rings animate on mount
- Habit cards flip on completion
- Smooth page transitions between routes
- Pull-to-refresh animation (mobile)

### Tech Implementation
- Framer Motion for all layout animations, page transitions, and gesture support
- CSS animations (tw-animate-css) for micro-interactions
- Canvas/SVG for the mosque builder visual
- Lottie (optional) for complex celebration animations

---

## Social Features

### Friends System
1. Search users by username or email
2. Send friend request - notification sent to recipient
3. Accept/decline friend requests
4. View friends list with their current streak and level
5. Remove friends

### Leaderboard
1. Ranked list of friends by XP
2. Filter: Daily / This Week / All Time
3. Top 3 highlighted with gold/silver/bronze
4. Your own rank always visible (sticky)
5. Tap a friend to view their public profile

### Group Challenges
1. Create a challenge (e.g., "Read Quran Daily for 10 Days")
2. Set start/end dates
3. Invite friends to join
4. Track each participant's progress
5. Challenge completion awards bonus XP
6. Challenge leaderboard within the group

### Shareable Progress Cards
1. Generate a styled card showing:
   - User's name and level
   - Current streak
   - Habits completed today
   - Mosque progress visual
2. Download as image (PNG)
3. Share directly to social media
4. Card styled with Islamic geometric patterns

---

## Implementation Phases

### Phase 1 - Foundation (Priority: HIGH)
- [ ] Install dependencies (Clerk, Framer Motion, shadcn components)
- [ ] Set up Clerk authentication (sign-in, sign-up, middleware)
- [ ] Create Convex schema (schema.ts)
- [ ] Wire ConvexProvider + ClerkProvider into layout.tsx
- [ ] Build app layout (sidebar navigation, responsive shell)
- [ ] Import custom fonts (Plus Jakarta Sans, Lora)
- [ ] Create user sync (Clerk webhook to Convex user record)

### Phase 2 - Core Habit Tracking (Priority: HIGH)
- [ ] Seed default habits in Convex
- [ ] Build dashboard page with daily habit checklist
- [ ] Implement habit completion (mutation + optimistic updates)
- [ ] Build habit manager page (browse defaults, create custom)
- [ ] Implement XP calculation and level system
- [ ] Build streak tracking logic
- [ ] Create profile page with user stats

### Phase 3 - Gamification and Animations (Priority: HIGH)
- [ ] Build mosque/lantern progress visual (SVG/Canvas)
- [ ] Implement confetti celebration on daily completion
- [ ] Add XP bar with smooth fill animation
- [ ] Create level-up animation overlay
- [ ] Implement streak flame/fire animation
- [ ] Add badge system and badge earned animation
- [ ] Staggered card animations on page loads
- [ ] Habit completion micro-interactions (checkmark bounce)

### Phase 4 - Social Features (Priority: MEDIUM)
- [ ] Build friend search and request system
- [ ] Create notifications system
- [ ] Build leaderboard page (daily/weekly/all-time)
- [ ] Implement group challenges (create, join, track)
- [ ] Build shareable progress card generator
- [ ] Add challenge completion rewards

### Phase 5 - Polish and Production (Priority: MEDIUM)
- [ ] 30-day calendar view with habit history
- [ ] Progress charts and statistics
- [ ] Responsive design audit (mobile-first)
- [ ] Loading states and skeleton screens
- [ ] Error boundaries and error handling
- [ ] SEO and metadata
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Deploy to Vercel
- [ ] Connect custom domain (if applicable)

---

## File Structure (Target)

```
ramadan-habits/
  app/
    (auth)/
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
    (app)/
      layout.tsx          # Authenticated layout with sidebar
      dashboard/page.tsx  # Main dashboard
      habits/page.tsx     # Habit manager
      progress/page.tsx   # 30-day progress view
      friends/page.tsx    # Friends and leaderboard
      challenges/page.tsx # Group challenges
      profile/page.tsx    # User profile and settings
    layout.tsx              # Root layout (providers)
    page.tsx                # Landing page
    globals.css
  components/
    ui/                     # shadcn components
    layout/
      sidebar.tsx
      header.tsx
      mobile-nav.tsx
    dashboard/
      daily-checklist.tsx
      xp-bar.tsx
      streak-counter.tsx
      mosque-builder.tsx
    habits/
      habit-card.tsx
      habit-form.tsx
      category-filter.tsx
    social/
      friend-card.tsx
      leaderboard.tsx
      challenge-card.tsx
      share-card.tsx
    animations/
      confetti.tsx
      level-up.tsx
      streak-flame.tsx
      page-transition.tsx
    providers/
      convex-client-provider.tsx
  convex/
    schema.ts
    users.ts
    habits.ts
    habitLogs.ts
    friendships.ts
    challenges.ts
    notifications.ts
    badges.ts
    seed.ts                 # Default habits seed data
  lib/
    utils.ts
    constants.ts            # XP thresholds, badge definitions
    gamification.ts         # Level calc, streak logic
  hooks/
    use-habits.ts
    use-gamification.ts
    use-friends.ts
  public/
    mosque/                 # SVG assets for mosque builder
    badges/                 # Badge icon assets
```

---

## Key Design Decisions

1. **Clerk for Auth** - Provides polished pre-built auth UI with social logins, integrates cleanly with Convex via webhooks
2. **Convex for Backend** - Real-time by default (leaderboards update live), no API layer to manage, reactive queries
3. **Mosque Builder as Hero Visual** - Culturally meaningful, provides daily motivation, progressive across 30 days
4. **XP-based Gamification** - Simple to understand, flexible scoring, supports leaderboard ranking
5. **shadcn/ui Components** - Accessible, customizable, consistent with the Tailwind setup already in place
6. **Framer Motion** - Best-in-class React animation library, supports layout animations and gesture interactions

---

## Notes

- Ramadan 2026 starts approximately February 17, 2026 - app should be ready before then
- All times should respect the user's local timezone
- Islamic content should be respectful and accurate
- The app should work well on both desktop and mobile
- Dark mode support is already configured in the CSS variables
