"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CATEGORY_INFO, HABIT_CATEGORIES, type HabitCategory } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, type LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Id } from "@/convex/_generated/dataModel";

// Curated list of common icons for habit creation
const ICON_OPTIONS = [
  { value: "Star", label: "Star" },
  { value: "Sun", label: "Sun" },
  { value: "Moon", label: "Moon" },
  { value: "Sunrise", label: "Sunrise" },
  { value: "Sunset", label: "Sunset" },
  { value: "Heart", label: "Heart" },
  { value: "BookOpen", label: "Book" },
  { value: "BookOpenCheck", label: "Book (Check)" },
  { value: "Brain", label: "Brain" },
  { value: "Headphones", label: "Headphones" },
  { value: "HandHeart", label: "Helping Hand" },
  { value: "HandHelping", label: "Hand Helping" },
  { value: "Utensils", label: "Utensils" },
  { value: "Coffee", label: "Coffee" },
  { value: "Clock", label: "Clock" },
  { value: "Timer", label: "Timer" },
  { value: "Target", label: "Target" },
  { value: "Trophy", label: "Trophy" },
  { value: "Flame", label: "Flame" },
  { value: "Sparkles", label: "Sparkles" },
  { value: "Smile", label: "Smile" },
  { value: "Users", label: "Users" },
  { value: "ShieldCheck", label: "Shield Check" },
  { value: "CircleDollarSign", label: "Dollar Sign" },
  { value: "Footprints", label: "Footprints" },
  { value: "Pen", label: "Pen" },
  { value: "Dumbbell", label: "Dumbbell" },
  { value: "Leaf", label: "Leaf" },
  { value: "Zap", label: "Zap" },
] as const;

function getIcon(iconName: string | undefined): React.ComponentType<LucideProps> | null {
  if (!iconName) return null;
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>;
  return icons[iconName] || null;
}

export default function HabitsPage() {
  const [activeCategory, setActiveCategory] = useState<HabitCategory | "all">("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<{
    id: Id<"habits">;
    title: string;
    category: string;
    description: string;
    xpReward: number;
    icon: string;
  } | null>(null);

  const defaultHabits = useQuery(api.habits.getDefaultHabits);
  const userHabits = useQuery(api.habits.getUserHabits);
  const createHabit = useMutation(api.habits.createHabit);
  const updateHabit = useMutation(api.habits.updateHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);

  const allHabits = [
    ...(defaultHabits ?? []),
    ...(userHabits ?? []),
  ].sort((a, b) => a.order - b.order);

  const filteredHabits =
    activeCategory === "all"
      ? allHabits
      : allHabits.filter((h) => h.category === activeCategory);

  const handleCreate = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const xpReward = parseInt(formData.get("xpReward") as string) || 15;
    const icon = formData.get("icon") as string;

    await createHabit({
      title,
      category,
      description: description || undefined,
      xpReward,
      icon: icon || undefined,
    });
    setIsCreateOpen(false);
  };

  const handleUpdate = async (formData: FormData) => {
    if (!editingHabit) return;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const xpReward = parseInt(formData.get("xpReward") as string) || 15;
    const icon = formData.get("icon") as string;

    await updateHabit({
      habitId: editingHabit.id,
      title,
      category,
      description: description || undefined,
      xpReward,
      icon: icon || undefined,
    });
    setEditingHabit(null);
  };

  const handleDelete = async (habitId: Id<"habits">) => {
    await deleteHabit({ habitId });
  };

  if (!defaultHabits || !userHabits) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Habits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and manage your daily habits
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="h-4 w-4 mr-1" />
            Add Custom
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Habit</DialogTitle>
            </DialogHeader>
            <HabitForm onSubmit={handleCreate} submitLabel="Create Habit" />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          )}
        >
          All ({allHabits.length})
        </button>
        {HABIT_CATEGORIES.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const count = allHabits.filter((h) => h.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors border",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </motion.div>

      {/* Habit List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit, index) => {
            const info = CATEGORY_INFO[habit.category as HabitCategory];
            const HabitIcon = getIcon(habit.icon ?? undefined);
            const isCustom = !habit.isDefault;

            return (
              <motion.div
                key={habit._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.02 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                    info?.bgColor ?? "bg-muted"
                  )}
                >
                  {HabitIcon && (
                    <HabitIcon
                      className={cn("h-4 w-4", info?.color ?? "text-foreground")}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{habit.title}</p>
                  {habit.description && (
                    <p className="text-xs text-muted-foreground truncate">
                      {habit.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-primary">
                    +{habit.xpReward} XP
                  </span>

                  {isCustom && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() =>
                          setEditingHabit({
                            id: habit._id,
                            title: habit.title,
                            category: habit.category,
                            description: habit.description ?? "",
                            xpReward: habit.xpReward,
                            icon: habit.icon ?? "",
                          })
                        }
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDelete(habit._id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  )}

                  {!isCustom && (
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingHabit}
        onOpenChange={(open) => !open && setEditingHabit(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
          </DialogHeader>
          {editingHabit && (
            <HabitForm
              onSubmit={handleUpdate}
              submitLabel="Save Changes"
              defaultValues={editingHabit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HabitForm({
  onSubmit,
  submitLabel,
  defaultValues,
}: {
  onSubmit: (formData: FormData) => void;
  submitLabel: string;
  defaultValues?: {
    title: string;
    category: string;
    description: string;
    xpReward: number;
    icon: string;
  };
}) {
  const [selectedIcon, setSelectedIcon] = useState(defaultValues?.icon ?? "Star");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("icon", selectedIcon);
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g., Read Quran for 30 minutes"
          defaultValue={defaultValues?.title}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? "prayer"}
          className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {HABIT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_INFO[cat].label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Add a description..."
          defaultValue={defaultValues?.description}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xpReward">XP Reward</Label>
          <Input
            id="xpReward"
            name="xpReward"
            type="number"
            min={5}
            max={50}
            defaultValue={defaultValues?.xpReward ?? 15}
          />
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <Select
            defaultValue={selectedIcon}
            onValueChange={(val) => setSelectedIcon(val as string)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(value: string) => {
                  const Icon = getIcon(value);
                  const option = ICON_OPTIONS.find((o) => o.value === value);
                  return (
                    <>
                      {Icon && <Icon className="h-4 w-4" />}
                      {option?.label ?? value}
                    </>
                  );
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map((opt) => {
                const Icon = getIcon(opt.value);
                return (
                  <SelectItem key={opt.value} value={opt.value}>
                    {Icon && <Icon className="h-4 w-4" />}
                    {opt.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
