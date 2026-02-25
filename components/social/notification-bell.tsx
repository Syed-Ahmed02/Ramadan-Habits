"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bell,
  Check,
  UserPlus,
  Swords,
  Trophy,
  Flame,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { LucideProps } from "lucide-react";

const NOTIFICATION_ICONS: Record<string, React.FC<LucideProps>> = {
  friend_request: UserPlus,
  challenge_invite: Swords,
  achievement: Trophy,
  streak: Flame,
};

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const notifications = useQuery(api.notifications.getNotifications);
  const markAsRead = useMutation(api.notifications.markAsRead);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {unreadCount! > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-border bg-popover shadow-lg"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold">Notifications</h3>
                {(unreadCount ?? 0) > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllRead}
                    className="text-xs h-auto py-1 px-2"
                  >
                    Mark all read
                  </Button>
                )}
              </div>

              {/* Notifications list */}
              <ScrollArea className="max-h-80">
                {notifications === undefined && (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                    ))}
                  </div>
                )}
                {notifications && notifications.length === 0 && (
                  <div className="p-6 text-sm text-muted-foreground text-center">
                    No notifications yet
                  </div>
                )}
                {notifications?.map((notification) => {
                  const Icon =
                    NOTIFICATION_ICONS[notification.type] ?? Bell;
                  return (
                    <div
                      key={notification._id}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0 transition-colors ${
                        !notification.read
                          ? "bg-primary/5"
                          : ""
                      }`}
                    >
                      {notification.relatedUser?.avatarUrl ? (
                        <Avatar size="sm">
                          <AvatarImage
                            src={notification.relatedUser.avatarUrl}
                            alt={notification.relatedUser.name}
                          />
                          <AvatarFallback>
                            {notification.relatedUser.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                          <Icon className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              markAsRead({
                                notificationId: notification._id,
                              })
                            }
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            deleteNotification({
                              notificationId: notification._id,
                            })
                          }
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
