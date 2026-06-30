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
  CheckCircle2,
  Upload,
  X,
  Plane,
  UtensilsCrossed,
  BedDouble,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { useCategoriesStore } from "@/lib/stores/useCategoriesStore";
import { createExpense } from "@/app/actions/expenses";
import { uploadReceipt } from "@/app/actions/upload";
import { categoryIcon } from "@/components/expense-ui";
import { cn, formatEUR } from "@/lib/utils";

const CATEGORY_VISUALS: Record<string, LucideIcon> = {
  Transport: Plane,
  Repas: UtensilsCrossed,
  Hôtel: BedDouble,
};

export default function CreateExpensePage() {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const { items: categories, fetchCategories } = useCategoriesStore();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialized && !user) router.replace("/connexion");
  }, [initialized, user, router]);

  useEffect(() => {
    if (user) void fetchCategories();
  }, [user, fetchCategories]);

  // Local object-URL preview of the chosen file.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setError(null);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const amountNum = parseFloat(amount.replace(",", "."));
  const amountValid = !Number.isNaN(amountNum) && amountNum > 0;
  const formValid = amountValid && category && expenseDate;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setError("Vous devez être connecté.");
      return;
    }
    if (!formValid) {
      setError("Veuillez renseigner le montant, la catégorie et la date.");
      return;
    }

    setError(null);
    setSubmitting(true);

    let receiptUrl: string | null = null;
    if (file) {
      setUploading(true);
      const up = await uploadReceipt(file, file.name);
      setUploading(false);
      if (up.error || !up.url) {
        setSubmitting(false);
        setError(up.error ?? "Échec de l'envoi du justificatif.");
        return;
      }
      receiptUrl = up.url;
    }

    const result = await createExpense(
      {
        amount_eur: amountNum,
        description: category, // category name stored in description column
        comment: comment.trim() || null,
        expense_date: expenseDate,
        receipt_url: receiptUrl,
        status: "en_attente",
      },
      user.id,
    );

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`/depenses/${result.data.id}`);
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 grain opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Breadcrumb */}
        <Link
          href="/depenses"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux notes
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Nouvelle dépense
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
            Ajouter une note de frais
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Renseignez le montant, la catégorie et la date, puis joignez la
            photo du justificatif.
          </p>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-refused/20 bg-refused/5 px-4 py-3 text-sm text-refused">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
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
                    <span>
                      <span className="block text-sm font-semibold text-ink-950">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span className="mt-0.5 block text-xs text-ink-400">
                          {cat.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
              {categories.length === 0 && (
                <p className="col-span-full text-sm text-ink-400">
                  Chargement des catégories…
                </p>
              )}
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
                  placeholder="0,00"
                  className="w-full rounded-xl border border-ink-200 bg-paper py-3.5 pl-11 pr-4 text-lg font-semibold text-ink-950 transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
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

          {/* ===== Receipt upload ===== */}
          <div className="surface-elevated rounded-2xl p-6">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-500">
              Justificatif (photo du ticket)
            </span>
            <input
              ref={fileInputRef}
              id="receipt"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl ? (
              <div className="mt-4 flex items-center gap-4 rounded-xl border border-ink-200 bg-cream p-3">
                <img
                  src={previewUrl}
                  alt="Aperçu du justificatif"
                  className="h-20 w-20 shrink-0 rounded-lg object-cover ring-1 ring-ink-200"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-950">
                    {file?.name ?? "Justificatif"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Fichier prêt à envoyer
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="grid h-8 w-8 place-items-center rounded-full text-ink-400 transition hover:bg-refused/10 hover:text-refused"
                  aria-label="Retirer le fichier"
                >
                  <X className="h-4 w-4" />
                </button>
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
                    Photographier ou choisir un fichier
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
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href="/depenses"
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
                  Enregistrer la note
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
