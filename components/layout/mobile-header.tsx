"use client";

import { UserButton } from "@clerk/nextjs";
import { Star } from "lucide-react";
import Link from "next/link";
import { NotificationBell } from "@/components/social/notification-bell";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))] lg:hidden">
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
