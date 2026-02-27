"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ListChecks,
  BarChart3,
  Users,
  Swords,
  User,
  Star,
  Flame,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationBell } from "@/components/social/notification-bell";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/habits", label: "Habits", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/challenges", label: "Challenges", icon: Swords },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useQuery(api.users.getCurrentUser);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary shrink-0">
                <Star className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight truncate">
                Ramadan Habits
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {user ? (
              <div className="flex items-center gap-3 w-full rounded-lg px-3 py-2 min-h-14">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 shrink-0",
                    },
                  }}
                />
                <div className="flex-1 min-w-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="h-3 w-3 text-orange-500 shrink-0" />
                    <span>{user.streak} day streak</span>
                    <span className="mx-1">-</span>
                    <span>Lvl {user.level}</span>
                  </div>
                </div>
                <div className="shrink-0 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <NotificationBell />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full rounded-lg px-3 py-2 min-h-14">
                <UserButton />
                <div className="flex-1 space-y-2 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
