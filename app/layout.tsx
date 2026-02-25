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

export const metadata: Metadata = {
  title: "Ramadan Habits - Track Your Good Deeds This Ramadan",
  description:
    "A gamified Ramadan productivity app. Track daily good deeds, earn XP, build streaks, compete with friends, and grow spiritually throughout the blessed month.",
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
