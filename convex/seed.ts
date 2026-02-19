import { mutation } from "./_generated/server";

// Seed the default habits into the database
export const seedDefaultHabits = mutation({
  handler: async (ctx) => {
    // Check if defaults already exist
    const existing = await ctx.db
      .query("habits")
      .filter((q) => q.eq(q.field("isDefault"), true))
      .first();

    if (existing) {
      return { message: "Default habits already seeded." };
    }

    const defaultHabits = [
      // Prayer
      { title: "Fajr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 1 },
      { title: "Dhuhr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 2 },
      { title: "Asr Prayer", category: "prayer", xpReward: 20, icon: "Sun", order: 3 },
      { title: "Maghrib Prayer", category: "prayer", xpReward: 20, icon: "Sunset", order: 4 },
      { title: "Isha Prayer", category: "prayer", xpReward: 20, icon: "Moon", order: 5 },
      { title: "Taraweeh Prayer", category: "prayer", xpReward: 25, icon: "Star", order: 6 },
      { title: "Tahajjud / Qiyam al-Layl", category: "prayer", xpReward: 25, icon: "Moon", order: 7 },
      { title: "Duha Prayer", category: "prayer", xpReward: 15, icon: "Sunrise", order: 8 },
      // Quran
      { title: "Read 1 Juz", category: "quran", xpReward: 30, icon: "BookOpen", order: 9 },
      { title: "Memorize an Ayah", category: "quran", xpReward: 25, icon: "Brain", order: 10 },
      { title: "Listen to Tafsir", category: "quran", xpReward: 20, icon: "Headphones", order: 11 },
      { title: "Recite with Tajweed", category: "quran", xpReward: 20, icon: "BookOpenCheck", order: 12 },
      // Dhikr
      { title: "Morning Adhkar", category: "dhikr", xpReward: 15, icon: "Sunrise", order: 13 },
      { title: "Evening Adhkar", category: "dhikr", xpReward: 15, icon: "Sunset", order: 14 },
      { title: "100x SubhanAllah", category: "dhikr", xpReward: 10, icon: "Heart", order: 15 },
      { title: "100x Alhamdulillah", category: "dhikr", xpReward: 10, icon: "Heart", order: 16 },
      { title: "100x Istighfar", category: "dhikr", xpReward: 10, icon: "Heart", order: 17 },
      { title: "Send Salawat on the Prophet", category: "dhikr", xpReward: 10, icon: "Heart", order: 18 },
      // Charity
      { title: "Give Daily Sadaqah", category: "charity", xpReward: 25, icon: "HandHeart", order: 19 },
      { title: "Feed Someone Iftar", category: "charity", xpReward: 25, icon: "Utensils", order: 20 },
      { title: "Donate to a Cause", category: "charity", xpReward: 20, icon: "CircleDollarSign", order: 21 },
      { title: "Help a Neighbor", category: "charity", xpReward: 20, icon: "Users", order: 22 },
      // Character
      { title: "No Backbiting", category: "character", xpReward: 20, icon: "ShieldCheck", order: 23 },
      { title: "Smile at Others", category: "character", xpReward: 15, icon: "Smile", order: 24 },
      { title: "Help Someone in Need", category: "character", xpReward: 20, icon: "HandHelping", order: 25 },
      { title: "Practice Patience", category: "character", xpReward: 15, icon: "Timer", order: 26 },
      { title: "Make Dua for Others", category: "character", xpReward: 15, icon: "Sparkles", order: 27 },
      // Fasting
      { title: "Fast the Day", category: "fasting", xpReward: 25, icon: "Moon", order: 28 },
      { title: "Eat Suhoor", category: "fasting", xpReward: 20, icon: "Coffee", order: 29 },
      { title: "Break Fast on Time", category: "fasting", xpReward: 20, icon: "Clock", order: 30 },
    ];

    for (const habit of defaultHabits) {
      await ctx.db.insert("habits", {
        ...habit,
        userId: undefined,
        description: undefined,
        isDefault: true,
      });
    }

    return { message: `Seeded ${defaultHabits.length} default habits.` };
  },
});
