"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  Users,
  Swords,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/challenges", label: "Challenges", icon: Swords },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-1 sm:px-2 py-2 gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                "flex min-w-[44px] min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 sm:px-2 py-2 text-[10px] sm:text-xs transition-colors touch-manipulation",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground active:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <span className="font-medium truncate max-w-[52px] sm:max-w-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
