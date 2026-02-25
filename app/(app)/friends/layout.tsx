import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Friends & Leaderboard",
  description: "Connect with friends, view the leaderboard, and compete in your Ramadan journey.",
};

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
