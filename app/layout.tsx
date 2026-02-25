import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ClerkClientProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://ramadan-habits.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Ramadan Habits - Track Your Good Deeds This Ramadan",
    template: "%s | Ramadan Habits",
  },
  description:
    "A gamified Ramadan productivity app. Track daily good deeds, earn XP, build streaks, compete with friends, and grow spiritually throughout the blessed month.",
  keywords: [
    "Ramadan",
    "habits",
    "productivity",
    "Muslim",
    "good deeds",
    "ibadah",
    "streak",
    "gamification",
    "prayer",
    "Quran",
    "dhikr",
    "charity",
  ],
  authors: [{ name: "Ramadan Habits" }],
  creator: "Ramadan Habits",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Ramadan Habits",
    title: "Ramadan Habits - Track Your Good Deeds This Ramadan",
    description:
      "A gamified Ramadan productivity app. Track daily good deeds, earn XP, build streaks, compete with friends, and grow spiritually throughout the blessed month.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramadan Habits - Track Your Good Deeds This Ramadan",
    description:
      "A gamified Ramadan productivity app. Track daily good deeds, earn XP, build streaks, and grow spiritually.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${plusJakartaSans.variable} ${lora.variable} font-sans antialiased`}
        >
          {children}
        </body>
      </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
