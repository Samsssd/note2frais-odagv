"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Euro,
  Receipt,
  ImageIcon,
  User as UserIcon,
  Pencil,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type ExpenseRow, type UserRow } from "@/lib/supabase/tables";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import {
  CategoryChip,
  StatusBadge,
  categoryIcon,
} from "@/components/expense-ui";
import { cn, formatEUR, formatDate, formatDateTime } from "@/lib/utils";

export function ExpenseDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, isManager, initialized } = useAuthStore();

  const [expense, setExpense] = useState<ExpenseRow | null>(null);
  const [author, setAuthor] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && !user) router.replace("/connexion");
  }, [initialized, user, router]);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);
      const { data, error: err } = await supabase
        .from(TABLES.reviews)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!active) return;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      if (!data) {
        setError("Note de frais introuvable.");
        setLoading(false);
        return;
      }

      const row = data as ExpenseRow;
      setExpense(row);

      // For managers, also load the author's profile for display.
      if (row.user_id && row.user_id !== user!.id) {
        const { data: u } = await supabase
          .from(TABLES.users)
          .select("*")
          .eq("id", row.user_id)
          .maybeSingle();
        if (active) setAuthor((u as UserRow) ?? null);
      } else if (row.user_id === user!.id) {
        if (active) setAuthor(null); // own expense, no need
      }

      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [id, user]);

  // ---- Loading ----
  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <DetailSkeleton />
      </div>
    );
  }

  // ---- Error ----
  if (error || !expense) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/depenses"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux notes
        </Link>
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-cream px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-refused/10 text-refused">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink-950">
            {error ?? "Une erreur est survenue."}
          </h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Cette note de frais n'a pas pu être chargée.
          </p>
        </div>
      </div>
    );
  }

  const Icon = categoryIcon(expense.description);
  const isOwner = expense.user_id === user?.id;
  const canEdit = isOwner || isManager;

  return (
    <div className="relative">
      <div className="absolute inset-0 grain opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/depenses"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux notes
        </Link>

        {/* Header */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
                  {formatEUR(expense.amount_eur)}
                </h1>
                <StatusBadge status={expense.status} />
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <CategoryChip name={expense.description} />
                <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(expense.expense_date)}
                </span>
              </div>
            </div>
          </div>

          {canEdit && (
            <Link
              href={`/depenses/${expense.id}/modifier`}
              className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-cream px-5 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              <Pencil className="h-4 w-4" />
              Modifier
            </Link>
          )}
        </div>

        {/* Grid: details + receipt */}
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Details card */}
          <div className="surface-elevated rounded-3xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
              <FileText className="h-4 w-4" />
              Détails de la dépense
            </h2>

            <dl className="mt-6 divide-y divide-ink-100">
              <DetailRow
                icon={Euro}
                label="Montant"
                value={formatEUR(expense.amount_eur)}
                strong
              />
              <DetailRow
                icon={Icon}
                label="Catégorie"
                value={expense.description}
              />
              <DetailRow
                icon={CalendarDays}
                label="Date de la dépense"
                value={formatDate(expense.expense_date)}
              />
              <DetailRow
                icon={CalendarDays}
                label="Saisie le"
                value={formatDateTime(expense.created_at)}
              />
              {author && (
                <DetailRow
                  icon={UserIcon}
                  label="Consultant"
                  value={author.full_name || author.email}
                />
              )}
              {expense.comment && (
                <div className="flex gap-3 py-4">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-ink-800">
                      {expense.comment}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Receipt card */}
          <div className="surface-elevated rounded-3xl p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-400">
              <ImageIcon className="h-4 w-4" />
              Justificatif
            </h2>

            {expense.receipt_url ? (
              <div className="mt-6">
                <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-950">
                  <img
                    src={expense.receipt_url}
                    alt="Justificatif de la dépense"
                    className="h-full w-full object-contain"
                  />
                </div>
                <a
                  href={expense.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  <ArrowRight className="h-4 w-4" />
                  Ouvrir le justificatif
                </a>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-cream px-6 py-14 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper text-ink-300 ring-1 ring-ink-100">
                  <Receipt className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-medium text-ink-600">
                  Aucun justificatif joint
                </p>
                <p className="mt-0.5 text-xs text-ink-400">
                  Cette note a été créée sans photo de ticket.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-paper text-ink-400 ring-1 ring-ink-100">
          <Icon className="h-4 w-4" />
        </span>
        <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">
          {label}
        </dt>
      </div>
      <dd
        className={cn(
          "text-sm",
          strong ? "text-lg font-semibold text-ink-950" : "text-ink-800",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <>
      <div className="h-4 w-32 skeleton rounded" />
      <div className="mt-6 flex items-center gap-4">
        <div className="h-14 w-14 skeleton rounded-2xl" />
        <div className="space-y-2">
          <div className="h-8 w-40 skeleton rounded" />
          <div className="h-4 w-28 skeleton rounded" />
        </div>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="h-72 skeleton rounded-3xl" />
        <div className="h-72 skeleton rounded-3xl" />
      </div>
    </>
  );
}
