import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile, view your badges, and share your Ramadan progress.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
