"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Receipt,
  Euro,
  CalendarDays,
  AlertCircle,
  ArrowRight,
  Loader2,
  Camera,
  Inbox,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useExpensesStore } from "@/lib/stores/useExpensesStore";
import { useUsersStore } from "@/lib/stores/useUsersStore";
import {
  StatusBadge,
  CategoryChip,
  categoryIcon,
  sumExpenses,
} from "@/components/expense-ui";
import { cn, formatEUR, formatDate } from "@/lib/utils";

export default function ExpensesPage() {
  const router = useRouter();
  const { user, profile, isManager, initialized } = useAuthStore();
  const { items, loading, error, fetchExpenses } = useExpensesStore();
  const { all, getUserById, fetchUsers } = useUsersStore();

  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Gate: redirect to sign-in when unauthenticated.
  useEffect(() => {
    if (initialized && !user) router.replace("/connexion");
  }, [initialized, user, router]);

  // Fetch expenses (+ users for manager view) once authenticated.
  useEffect(() => {
    if (user) {
      void fetchExpenses();
      if (isManager) void fetchUsers();
    }
  }, [user, isManager, fetchExpenses, fetchUsers]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return items;
    return items.filter((e) => e.status === statusFilter);
  }, [items, statusFilter]);

  const totalDue = useMemo(() => sumExpenses(filtered), [filtered]);
  const pendingCount = useMemo(
    () => items.filter((e) => e.status === "en_attente").length,
    [items],
  );

  const showLoading = !initialized || (user && loading && items.length === 0);

  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* ===== Header ===== */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              {isManager ? "Vue gestionnaire · toutes les notes" : "Espace consultant"}
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
              Notes de frais
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {isManager
                ? "Consultez, filtrez et suivez les dépenses de toute l'équipe."
                : "Saisissez et suivez vos dépenses professionnelles."}
            </p>
          </div>
          <Link
            href="/depenses/nouveau"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            Nouvelle note
          </Link>
        </div>

        {/* ===== Stat cards ===== */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={Euro}
            label="Total affiché"
            value={formatEUR(totalDue)}
            tint="brand"
          />
          <StatCard
            icon={Receipt}
            label={isManager ? "Notes (équipe)" : "Mes notes"}
            value={String(items.length)}
            tint="ink"
          />
          <StatCard
            icon={Clock3}
            label="En attente"
            value={String(pendingCount)}
            tint="pending"
          />
        </div>

        {/* ===== Filters ===== */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Toutes" },
            { key: "en_attente", label: "En attente" },
            { key: "approuve", label: "Approuvées" },
            { key: "refuse", label: "Refusées" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition",
                statusFilter === f.key
                  ? "bg-ink-900 text-cream"
                  : "border border-ink-200 bg-cream text-ink-500 hover:border-brand-300 hover:text-ink-900",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ===== Content ===== */}
        <div className="mt-6">
          {showLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={() => void fetchExpenses()} />
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-3">
              {filtered.map((expense) => {
                const Icon = categoryIcon(expense.description);
                const owner = isManager
                  ? getUserById(expense.user_id)
                  : null;
                return (
                  <Link
                    key={expense.id}
                    href={`/depenses/${expense.id}`}
                    className="group surface-elevated flex items-center gap-4 rounded-2xl p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
                  >
                    {/* Icon / receipt thumb */}
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-paper text-brand-700 ring-1 ring-ink-100">
                      {expense.receipt_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={expense.receipt_url}
                          alt="Justificatif"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>

                    {/* Middle */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <CategoryChip name={expense.description} size="sm" />
                        <StatusBadge status={expense.status} size="sm" />
                      </div>
                      <p className="mt-1.5 truncate text-sm font-semibold text-ink-950">
                        {expense.comment || expense.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(expense.expense_date)}
                        </span>
                        {isManager && owner && (
                          <span className="inline-flex items-center gap-1">
                            <span className="grid h-4 w-4 place-items-center rounded-full bg-brand-600 text-[8px] font-bold text-white">
                              {(owner.full_name || owner.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                            {owner.full_name || owner.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-semibold tracking-tight text-ink-950">
                          {formatEUR(expense.amount_eur)}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
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
  icon: typeof Euro;
  label: string;
  value: string;
  tint: "brand" | "ink" | "pending";
}) {
  const tintMap = {
    brand: "bg-brand-600 text-white",
    ink: "bg-ink-900 text-cream",
    pending: "bg-accent-500 text-ink-950",
  } as const;
  return (
    <div className="surface-elevated flex items-center gap-4 rounded-2xl p-5">
      <div className={cn("grid h-11 w-11 place-items-center rounded-xl", tintMap[tint])}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-ink-950">
          {value}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="surface-elevated flex items-center gap-4 rounded-2xl p-5"
        >
          <div className="skeleton h-14 w-14 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-24 rounded-full" />
            <div className="skeleton h-3 w-48 rounded" />
          </div>
          <div className="skeleton h-6 w-20 rounded" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="surface-elevated flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-refused/10 text-refused">
        <AlertCircle className="h-7 w-7" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-ink-950">
          Impossible de charger les notes
        </h3>
        <p className="mt-1 max-w-md text-sm text-ink-500">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-ink-800"
      >
        <Loader2 className="h-4 w-4" />
        Réessayer
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="surface-elevated relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl px-6 py-20 text-center">
      <div
        className="absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl"
        aria-hidden
      />
      <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-paper text-brand-600 ring-1 ring-ink-100">
        <Inbox className="h-8 w-8" />
      </div>
      <div className="relative">
        <h3 className="text-xl font-semibold text-ink-950">
          Aucune note de frais pour l'instant
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
          Ajoutez votre première dépense en indiquant le montant, la catégorie,
          la date et une photo du justificatif.
        </p>
      </div>
      <Link
        href="/depenses/nouveau"
        className="relative inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
      >
        <Plus className="h-4 w-4" />
        Créer ma première note
      </Link>
      <div className="relative mt-2 flex items-center gap-2 text-xs text-ink-400">
        <Camera className="h-3.5 w-3.5" />
        Justificatif photo · <TrendingUp className="h-3.5 w-3.5" /> Calcul auto en euros
      </div>
    </div>
  );
}
