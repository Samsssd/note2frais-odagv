"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Euro,
  CalendarDays,
  Camera,
  Loader2,
  AlertCircle,
  Upload,
  X,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  Plane,
  UtensilsCrossed,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type ExpenseRow } from "@/lib/supabase/tables";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCategoriesStore } from "@/lib/stores/useCategoriesStore";
import { updateExpense, deleteExpense } from "@/app/actions/expenses";
import { uploadReceipt } from "@/app/actions/upload";
import { categoryIcon } from "@/components/expense-ui";
import { cn, formatEUR } from "@/lib/utils";

const CATEGORY_VISUALS: Record<string, LucideIcon> = {
  Transport: Plane,
  Repas: UtensilsCrossed,
  Hôtel: BedDouble,
};

const STATUS_OPTIONS = [
  { value: "en_attente", label: "En attente" },
  { value: "approuve", label: "Approuvée" },
  { value: "refuse", label: "Refusée" },
];

export function ExpenseEditClient({ id }: { id: string }) {
  const router = useRouter();
  const { user, isManager, initialized } = useAuthStore();
  const { items: categories, fetchCategories } = useCategoriesStore();

  const [expense, setExpense] = useState<ExpenseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  // form state
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("en_attente");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [keepReceipt, setKeepReceipt] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized && !user) router.replace("/connexion");
  }, [initialized, user, router]);

  // Load the expense record.
  useEffect(() => {
    if (!user) return;
    let active = true;

    async function load() {
      setLoading(true);
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
      const isOwner = row.user_id === user!.id;
      if (!isOwner && !isManager) {
        setForbidden(true);
        setLoading(false);
        return;
      }

      setExpense(row);
      setAmount(String(row.amount_eur));
      setCategory(row.description);
      setExpenseDate(row.expense_date);
      setComment(row.comment ?? "");
      setStatus(row.status);
      setPreviewUrl(row.receipt_url ?? null);
      setLoading(false);
    }

    void load();
    return () => {
      active = false;
    };
  }, [id, user, isManager]);

  useEffect(() => {
    if (user) void fetchCategories();
  }, [user, fetchCategories]);

  // Local preview for a newly chosen file.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setKeepReceipt(true);
    setFormError(null);
  }

  function clearFile() {
    setFile(null);
    setKeepReceipt(false);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const amountNum = parseFloat(amount.replace(",", "."));
  const amountValid = !Number.isNaN(amountNum) && amountNum > 0;
  const formValid = amountValid && category && expenseDate;

  // ---- Loading ----
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-4 w-32 skeleton rounded" />
        <div className="mt-8 h-96 skeleton rounded-3xl" />
      </div>
    );
  }

  // ---- Forbidden ----
  if (forbidden) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/depenses"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux notes
        </Link>
        <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-200 bg-cream px-6 py-16 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-refused/10 text-refused">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-ink-950">
            Accès non autorisé
          </h2>
          <p className="mt-1.5 max-w-sm text-sm text-ink-500">
            Seul le consultant propriétaire de cette note ou un gestionnaire
            peut la modifier.
          </p>
        </div>
      </div>
    );
  }

  // ---- Error / not found ----
  if (error || !expense) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
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
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !expense) return;
    if (!formValid) {
      setFormError("Veuillez renseigner le montant, la catégorie et la date.");
      return;
    }

    setFormError(null);
    setSubmitting(true);

    let receiptUrl: string | null | undefined = undefined;
    if (file) {
      setUploading(true);
      const up = await uploadReceipt(file, file.name);
      setUploading(false);
      if (up.error || !up.url) {
        setSubmitting(false);
        setFormError(up.error ?? "Échec de l'envoi du justificatif.");
        return;
      }
      receiptUrl = up.url;
    } else if (!keepReceipt) {
      receiptUrl = null;
    }

    const result = await updateExpense(expense.id, {
      amount_eur: amountNum,
      description: category,
      comment: comment.trim() || null,
      expense_date: expenseDate,
      status,
      ...(receiptUrl !== undefined ? { receipt_url: receiptUrl } : {}),
    }, user.id);

    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error);
      return;
    }
    router.push(`/depenses/${expense.id}`);
  }

  async function handleDelete() {
    if (!user || !expense) return;
    setSubmitting(true);
    const result = await deleteExpense(expense.id, user.id);
    setSubmitting(false);
    if (!result.success) {
      setFormError(result.error);
      setConfirmDelete(false);
      return;
    }
    router.push("/depenses");
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 grain opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={`/depenses/${expense.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la note
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Modification
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
            Modifier la note
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {isManager
              ? "En tant que gestionnaire, vous pouvez ajuster le statut et les détails."
              : "Ajustez les détails de votre dépense."}
          </p>
        </div>

        {formError && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-refused/20 bg-refused/5 px-4 py-3 text-sm text-refused">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* ===== Category select ===== */}
          <fieldset className="surface-elevated rounded-2xl p-6">
            <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Catégorie de dépense
            </legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {categories.map((cat) => {
                const Icon = CATEGORY_VISUALS[cat.name] ?? categoryIcon(cat.name);
                const selected = category === cat.name;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={cn(
                      "group flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition",
                      selected
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                        : "border-ink-200 bg-cream hover:border-brand-300",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-10 w-10 place-items-center rounded-xl transition",
                        selected
                          ? "bg-brand-600 text-white"
                          : "bg-paper text-brand-700 ring-1 ring-ink-100 group-hover:bg-brand-100",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-ink-950">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* ===== Amount + Date ===== */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="surface-elevated rounded-2xl p-6">
              <label
                htmlFor="amount"
                className="text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                Montant (€)
              </label>
              <div className="relative mt-3">
                <Euro className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600" />
                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 bg-paper py-3.5 pl-11 pr-4 text-lg font-semibold text-ink-950 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
              {amountValid && (
                <p className="mt-2 text-xs text-brand-700">
                  {formatEUR(amountNum)}
                </p>
              )}
            </div>

            <div className="surface-elevated rounded-2xl p-6">
              <label
                htmlFor="expenseDate"
                className="text-xs font-semibold uppercase tracking-wide text-ink-500"
              >
                Date de la dépense
              </label>
              <div className="relative mt-3">
                <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-600" />
                <input
                  id="expenseDate"
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full rounded-xl border border-ink-200 bg-paper py-3.5 pl-11 pr-4 text-sm font-medium text-ink-950 transition focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>
          </div>

          {/* ===== Status (manager only) ===== */}
          {isManager && (
            <div className="surface-elevated rounded-2xl p-6">
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                Statut de la note
              </span>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {STATUS_OPTIONS.map((opt) => {
                  const selected = status === opt.value;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={cn(
                        "rounded-xl border px-4 py-3 text-sm font-semibold transition",
                        selected
                          ? "border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-100"
                          : "border-ink-200 bg-cream text-ink-600 hover:border-brand-300",
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== Comment ===== */}
          <div className="surface-elevated rounded-2xl p-6">
            <label
              htmlFor="comment"
              className="text-xs font-semibold uppercase tracking-wide text-ink-500"
            >
              Description (optionnel)
            </label>
            <textarea
              id="comment"
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ex. : Déjeuner avec le client Acme"
              className="mt-3 w-full resize-none rounded-xl border border-ink-200 bg-paper px-4 py-3 text-sm text-ink-950 transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* ===== Receipt ===== */}
          <div className="surface-elevated rounded-2xl p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Justificatif
            </span>
            <input
              ref={fileInputRef}
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl && keepReceipt ? (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-ink-200 bg-cream p-3">
                <img
                  src={previewUrl}
                  alt="Aperçu du justificatif"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-ink-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-950">
                    {file?.name ?? "Justificatif actuel"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {file ? "Nouveau fichier prêt" : "Justificatif conservé"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <label
                    htmlFor="receipt"
                    className="cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                  >
                    Remplacer
                  </label>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-refused/10 hover:text-refused"
                    aria-label="Retirer le justificatif"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="receipt"
                className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-ink-200 bg-cream px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-paper text-brand-600 ring-1 ring-ink-100">
                  <Camera className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-900">
                    {expense.receipt_url
                      ? "Remplacer le justificatif"
                      : "Ajouter un justificatif"}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-400">
                    PNG, JPG — photo du ticket ou de la facture
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-cream">
                  <Upload className="h-3.5 w-3.5" />
                  Parcourir
                </span>
              </label>
            )}
          </div>

          {/* ===== Actions ===== */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-600">Confirmer la suppression ?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="rounded-full bg-refused px-4 py-2 text-xs font-semibold text-white transition hover:bg-refused/90 disabled:opacity-60"
                  >
                    Oui, supprimer
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-full border border-ink-200 px-4 py-2 text-xs font-semibold text-ink-500 transition hover:bg-ink-100"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-refused/30 bg-refused/5 px-5 py-3 text-sm font-semibold text-refused transition hover:bg-refused/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/depenses/${expense.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink-200 bg-cream px-5 py-3 text-sm font-semibold text-ink-600 transition hover:border-ink-300"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={submitting || !formValid}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {uploading ? "Envoi du justificatif…" : "Enregistrement…"}
                  </>
                ) : (
                  <>
                    Enregistrer
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
