import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track your daily good deeds, view your progress, and complete your Ramadan habits checklist.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
