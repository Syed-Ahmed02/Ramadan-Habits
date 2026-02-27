"use client";

import { UserButton } from "@clerk/nextjs";
import { Star } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/social/notification-bell";

export function MobileHeader() {
  return (
    <header className="flex flex-1 min-w-0 items-center justify-between lg:hidden">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
          <Star className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="text-base font-semibold tracking-tight">
          Ramadan Habits
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  );
}
