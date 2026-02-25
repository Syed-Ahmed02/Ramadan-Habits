import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habits",
  description: "Browse and manage your Ramadan habits. Add custom habits or choose from predefined good deeds.",
};

export default function HabitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
