"use client";

import {
  Plane,
  UtensilsCrossed,
  BedDouble,
  Tag,
  Clock3,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ExpenseRow } from "@/lib/supabase/tables";
import { cn } from "@/lib/utils";

export type ExpenseStatus = "en_attente" | "approuve" | "refuse";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Transport: Plane,
  Repas: UtensilsCrossed,
  Hôtel: BedDouble,
  Hotel: BedDouble,
};

export function categoryIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Tag;
  return CATEGORY_ICONS[name] ?? Tag;
}

export function statusLabel(status: string): string {
  switch (status) {
    case "en_attente":
      return "En attente";
    case "approuve":
      return "Approuvée";
    case "refuse":
      return "Refusée";
    default:
      return status;
  }
}

const STATUS_STYLES: Record<string, string> = {
  en_attente:
    "bg-pending/10 text-pending ring-1 ring-inset ring-pending/20",
  approuve:
    "bg-brand-50 text-approved ring-1 ring-inset ring-brand-200",
  refuse:
    "bg-refused/10 text-refused ring-1 ring-inset ring-refused/20",
};

const STATUS_ICONS: Record<string, LucideIcon> = {
  en_attente: Clock3,
  approuve: CheckCircle2,
  refuse: XCircle,
};

export function StatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const Icon = STATUS_ICONS[status] ?? Clock3;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        STATUS_STYLES[status] ??
          "bg-ink-100 text-ink-600 ring-1 ring-inset ring-ink-200",
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      {statusLabel(status)}
    </span>
  );
}

export function CategoryChip({
  name,
  size = "md",
}: {
  name: string | null | undefined;
  size?: "sm" | "md";
}) {
  const Icon = categoryIcon(name);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-paper text-ink-700 ring-1 ring-inset ring-ink-200",
        size === "sm" ? "px-2 py-0.5 text-[10px] font-medium" : "px-2.5 py-1 text-xs font-semibold",
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5", "text-brand-600")} />
      {name ?? "Autre"}
    </span>
  );
}

// Total of a set of expenses in EUR.
export function sumExpenses(items: ExpenseRow[]): number {
  return items.reduce((acc, e) => acc + Number(e.amount_eur || 0), 0);
}
