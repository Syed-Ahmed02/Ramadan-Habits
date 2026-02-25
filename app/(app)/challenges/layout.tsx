import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Create and join group challenges with friends. Track progress and earn bonus rewards.",
};

export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
