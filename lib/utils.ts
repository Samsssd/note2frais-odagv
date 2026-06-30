// Small classnames helper (no external deps).
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEUR(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "0,00 €";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "0,00 €";
  return eurFormatter.format(n);
}

export function formatDate(
  value: string | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" },
): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fr-FR", opts).format(d);
}

export function formatDateTime(value: string | null | undefined): string {
  return formatDate(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "2024-07" -> "Juillet 2024"
const monthLabelFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

export function monthLabel(ym: string): string {
  // ym = "yyyy-mm"
  const [y, m] = ym.split("-").map(Number);
  if (!y || !m) return ym;
  const d = new Date(y, m - 1, 1);
  return monthLabelFormatter.format(d);
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Distinct yyyy-mm keys present in a list of expense dates, newest first.
export function availableMonths(dates: Array<string | null | undefined>): string[] {
  const set = new Set<string>();
  for (const d of dates) {
    if (!d) continue;
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) continue;
    set.add(`${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`);
  }
  return Array.from(set).sort().reverse();
}
