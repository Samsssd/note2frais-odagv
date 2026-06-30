"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Filter,
  CalendarDays,
  Users,
  Euro,
  TrendingUp,
  ShieldAlert,
  Loader2,
  Receipt,
  ArrowRight,
  Plane,
  UtensilsCrossed,
  BedDouble,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useExpensesStore } from "@/lib/stores/useExpensesStore";
import { useUsersStore } from "@/lib/stores/useUsersStore";
import type { ExpenseRow, UserRow } from "@/lib/supabase/tables";
import {
  StatusBadge,
  CategoryChip,
  categoryIcon,
} from "@/components/expense-ui";
import {
  cn,
  formatEUR,
  formatDate,
  monthLabel,
  currentMonth,
  availableMonths,
} from "@/lib/utils";

const CATEGORY_TINT: Record<string, string> = {
  Transport: "bg-brand-50 text-brand-700 ring-brand-200",
  Repas: "bg-accent-400/15 text-accent-600 ring-accent-400/40",
  Hôtel: "bg-ink-100 text-ink-700 ring-ink-200",
  Hotel: "bg-ink-100 text-ink-700 ring-ink-200",
};

export default function ReportPage() {
  const router = useRouter();
  const { user, isManager, initialized } = useAuthStore();
  const { items: expenses, loading: expLoading, error: expError, fetchExpenses } =
    useExpensesStore();
  const { all: users, loading: usersLoading, error: usersError, fetchUsers } =
    useUsersStore();

  const [selectedConsultant, setSelectedConsultant] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth());

  useEffect(() => {
    if (initialized && !user) router.replace("/connexion");
  }, [initialized, user, router]);

  useEffect(() => {
    if (user && isManager) {
      void fetchUsers();
      void fetchExpenses();
    }
  }, [user, isManager, fetchUsers, fetchExpenses]);

  // All yyyy-mm months that appear in the expenses, plus the current month.
  const months = useMemo(() => {
    const ms = availableMonths(expenses.map((e) => e.expense_date));
    if (!ms.includes(currentMonth())) ms.unshift(currentMonth());
    return ms;
  }, [expenses]);

  // Keep the selection valid when the month list changes.
  useEffect(() => {
    if (months.length && !months.includes(selectedMonth)) {
      setSelectedMonth(months[0]);
    }
  }, [months, selectedMonth]);

  // Filter expenses by consultant + month.
  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const ym = e.expense_date
        ? `${e.expense_date.slice(0, 7)}`
        : "";
      const monthMatch = ym === selectedMonth;
      const consultMatch =
        selectedConsultant === "all" || e.user_id === selectedConsultant;
      return monthMatch && consultMatch;
    });
  }, [expenses, selectedMonth, selectedConsultant]);

  const totalDue = useMemo(
    () => filtered.reduce((acc, e) => acc + Number(e.amount_eur || 0), 0),
    [filtered],
  );

  // Per-category breakdown for the filtered set.
  const byCategory = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>();
    for (const e of filtered) {
      const key = e.description || "Autre";
      const cur = map.get(key) ?? { count: 0, total: 0 };
      cur.count += 1;
      cur.total += Number(e.amount_eur || 0);
      map.set(key, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [filtered]);

  // Per-consultant breakdown for the selected month (always all consultants).
  const byConsultant = useMemo(() => {
    const map = new Map<
      string,
      { user: UserRow | undefined; count: number; total: number }
    >();
    const monthExpenses = expenses.filter((e) => {
      const ym = e.expense_date ? e.expense_date.slice(0, 7) : "";
      return ym === selectedMonth;
    });
    for (const e of monthExpenses) {
      const cur = map.get(e.user_id) ?? {
        user: users.find((u) => u.id === e.user_id),
        count: 0,
        total: 0,
      };
      cur.count += 1;
      cur.total += Number(e.amount_eur || 0);
      map.set(e.user_id, cur);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].total - a[1].total);
  }, [expenses, users, selectedMonth]);

  const loading = expLoading || usersLoading;

  // ---- Not signed in yet (shell) ----
  if (!initialized) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ReportSkeleton />
      </div>
    );
  }

  // ---- Not a manager ----
  if (user && !isManager) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-cream px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-refused/10 text-refused">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-ink-950">
            Espace réservé aux gestionnaires
          </h1>
          <p className="mt-2 max-w-sm text-sm text-ink-500">
            Le rapport mensuel est accessible uniquement aux gestionnaires.
            Votre rôle consultant permet la saisie de vos notes de frais.
          </p>
          <Link
            href="/depenses"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            <Receipt className="h-4 w-4" />
            Accéder à mes notes
          </Link>
        </div>
      </div>
    );
  }

  const error = expError || usersError;

  // ---- Error ----
  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ReportHeader />
        <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-refused/30 bg-refused/5 px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-refused/10 text-refused">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink-950">
            Impossible de charger le rapport
          </h2>
          <p className="mt-1.5 text-sm text-refused">{error}</p>
          <button
            onClick={() => {
              void fetchUsers();
              void fetchExpenses();
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-200 bg-cream px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 grain opacity-40" aria-hidden />
      <div
        className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <ReportHeader />

        {/* ===== Filters ===== */}
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
          {/* Consultant filter */}
          <div className="surface-elevated rounded-2xl p-5">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <Users className="h-4 w-4" />
              Consultant
            </label>
            <div className="relative mt-2">
              <select
                value={selectedConsultant}
                onChange={(e) => setSelectedConsultant(e.target.value)}
                className="w-full appearance-none rounded-xl border border-ink-200 bg-paper py-3 pl-4 pr-10 text-sm font-medium text-ink-950 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">Tous les consultants</option>
                {users
                  .filter((u) => u.role !== "admin")
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.full_name || u.email}
                    </option>
                  ))}
              </select>
              <Filter className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
          </div>

          {/* Month filter */}
          <div className="surface-elevated rounded-2xl p-5">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-400">
              <CalendarDays className="h-4 w-4" />
              Mois
            </label>
            <div className="relative mt-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full appearance-none rounded-xl border border-ink-200 bg-paper py-3 pl-4 pr-10 text-sm font-medium text-ink-950 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {monthLabel(m)}
                  </option>
                ))}
              </select>
              <Filter className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
          </div>

          {/* Total due */}
          <div className="flex items-center justify-between rounded-2xl bg-ink-950 px-6 py-5 text-cream sm:flex-col sm:items-start sm:justify-center">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-400">
              Total dû
            </span>
            <span className="mt-0.5 text-2xl font-semibold tracking-tight text-brand-400 sm:text-3xl">
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-brand-400" />
              ) : (
                formatEUR(totalDue)
              )}
            </span>
          </div>
        </div>

        {/* ===== Loading ===== */}
        {loading ? (
          <div className="mt-8">
            <ReportSkeleton inline />
          </div>
        ) : filtered.length === 0 ? (
          /* ===== Empty ===== */
          <div className="mt-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-cream px-6 py-16 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-paper text-ink-300 ring-1 ring-ink-100">
              <BarChart3 className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-xl font-semibold text-ink-950">
              Aucune note pour cette période
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-ink-500">
              {selectedConsultant === "all"
                ? `Aucune dépense enregistrée en ${monthLabel(
                    selectedMonth,
                  ).toLowerCase()}.`
                : `Ce consultant n'a pas saisi de note en ${monthLabel(
                    selectedMonth,
                  ).toLowerCase()}.`}
            </p>
            <p className="mt-1 text-xs text-ink-400">
              {filtered.length} note · {formatEUR(totalDue)}
            </p>
          </div>
        ) : (
          <>
            {/* ===== Stat cards ===== */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={Euro}
                label="Total à rembourser"
                value={formatEUR(totalDue)}
                tint="bg-brand-600"
              />
              <StatCard
                icon={Receipt}
                label="Nombre de notes"
                value={String(filtered.length)}
                tint="bg-ink-900"
              />
              <StatCard
                icon={TrendingUp}
                label="Moyenne par note"
                value={formatEUR(totalDue / filtered.length)}
                tint="bg-accent-600"
              />
            </div>

            {/* ===== Breakdown + Table ===== */}
            <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              {/* Category breakdown */}
              <div className="surface-elevated rounded-3xl p-6 sm:p-7">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">
                  Répartition par catégorie
                </h2>
                <ul className="mt-5 space-y-4">
                  {byCategory.map(([name, { count, total }]) => {
                    const pct = totalDue > 0 ? (total / totalDue) * 100 : 0;
                    return (
                      <li key={name}>
                        <div className="flex items-center justify-between">
                          <CategoryChip name={name} size="sm" />
                          <span className="text-sm font-semibold text-ink-950">
                            {formatEUR(total)}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                            <div
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${Math.max(pct, 3)}%` }}
                            />
                          </div>
                          <span className="w-16 text-right text-xs text-ink-400">
                            {pct.toFixed(0)}% · {count}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Per-consultant mini table */}
                <h3 className="mt-8 border-t border-ink-100 pt-6 text-sm font-semibold uppercase tracking-wide text-ink-400">
                  Par consultant — {monthLabel(selectedMonth)}
                </h3>
                <ul className="mt-4 space-y-2">
                  {byConsultant.map(([uid, { user: u, count, total }]) => (
                    <li
                      key={uid}
                      className="flex items-center justify-between rounded-xl bg-paper px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-xs font-semibold text-cream">
                          {(u?.full_name || u?.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </span>
                        <div className="leading-tight">
                          <p className="text-sm font-semibold text-ink-950">
                            {u?.full_name || u?.email || "Inconnu"}
                          </p>
                          <p className="text-xs text-ink-400">{count} note(s)</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-ink-950">
                        {formatEUR(total)}
                      </span>
                    </li>
                  ))}
                  {byConsultant.length === 0 && (
                    <li className="rounded-xl bg-paper px-4 py-3 text-sm text-ink-400">
                      Aucune dépense ce mois-ci.
                    </li>
                  )}
                </ul>
              </div>

              {/* Expenses table */}
              <div className="surface-elevated overflow-hidden rounded-3xl">
                <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-400">
                    Détail des notes
                  </h2>
                  <span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold text-ink-500">
                    {filtered.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-ink-100 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                        <th className="px-6 py-3">Consultant</th>
                        <th className="px-4 py-3">Catégorie</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Statut</th>
                        <th className="px-6 py-3 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {filtered.map((e) => {
                        const u = users.find((x) => x.id === e.user_id);
                        return (
                          <tr
                            key={e.id}
                            className="group transition hover:bg-paper"
                          >
                            <td className="px-6 py-3.5">
                              <Link
                                href={`/depenses/${e.id}`}
                                className="flex items-center gap-2.5"
                              >
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-900 text-[10px] font-semibold text-cream">
                                  {(u?.full_name || u?.email || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                                <span className="font-medium text-ink-900 group-hover:text-brand-700">
                                  {u?.full_name || u?.email || "Inconnu"}
                                </span>
                              </Link>
                            </td>
                            <td className="px-4 py-3.5">
                              <CategoryChip name={e.description} size="sm" />
                            </td>
                            <td className="whitespace-nowrap px-4 py-3.5 text-ink-600">
                              {formatDate(e.expense_date, {
                                day: "2-digit",
                                month: "short",
                              })}
                            </td>
                            <td className="px-4 py-3.5">
                              <StatusBadge status={e.status} size="sm" />
                            </td>
                            <td className="whitespace-nowrap px-6 py-3.5 text-right font-semibold text-ink-950">
                              {formatEUR(e.amount_eur)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-ink-200 bg-ink-950">
                        <td
                          colSpan={4}
                          className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-brand-400"
                        >
                          Total dû — {monthLabel(selectedMonth)}
                        </td>
                        <td className="px-6 py-4 text-right text-lg font-semibold text-brand-400">
                          {formatEUR(totalDue)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ReportHeader() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
        Rapport mensuel
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
          Récapitulatif des frais
        </h1>
        <p className="flex items-center gap-2 text-sm text-ink-500">
          <BarChart3 className="h-4 w-4 text-brand-600" />
          Filtré par consultant et par mois
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="surface-elevated flex items-center gap-4 rounded-2xl p-5">
      <span
        className={cn(
          "grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white",
          tint,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
          {label}
        </p>
        <p className="mt-0.5 text-xl font-semibold tracking-tight text-ink-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function ReportSkeleton({ inline = false }: { inline?: boolean }) {
  return (
    <div className={inline ? "" : "pt-10"}>
      <div className="h-6 w-40 skeleton rounded" />
      <div className="mt-4 h-10 w-72 skeleton rounded-lg" />
      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <div className="h-20 skeleton rounded-2xl" />
        <div className="h-20 skeleton rounded-2xl" />
        <div className="h-20 skeleton rounded-2xl" />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="h-24 skeleton rounded-2xl" />
        <div className="h-24 skeleton rounded-2xl" />
        <div className="h-24 skeleton rounded-2xl" />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="h-80 skeleton rounded-3xl" />
        <div className="h-80 skeleton rounded-3xl" />
      </div>
    </div>
  );
}
