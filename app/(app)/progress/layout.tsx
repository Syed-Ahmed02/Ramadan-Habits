import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Progress",
  description: "View your 30-day Ramadan calendar, progress charts, and habit completion statistics.",
};

export default function ProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
