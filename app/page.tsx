import Link from "next/link";
import {
  Receipt,
  Camera,
  CalendarDays,
  Euro,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plane,
  UtensilsCrossed,
  BedDouble,
  FileCheck2,
  Users,
} from "lucide-react";
import AuthCTA from "@/components/AuthCTA";

const LOGO_URL =
  "https://d2w5g74r7hbhjx.cloudfront.net/app_b7abd1d2/branding/logo/9242b731fdec8e14mr0zqkv6.png";

const STEPS = [
  {
    icon: Receipt,
    title: "Saisissez",
    text: "Indiquez le montant en euros, la catégorie et la date de la dépense en quelques secondes.",
  },
  {
    icon: Camera,
    title: "Justifiez",
    text: "Photographiez le ticket ou la facture et joignez-le directement à la note de frais.",
  },
  {
    icon: FileCheck2,
    title: "Remboursez",
    text: "En fin de mois, le tableau récapitulatif calcule automatiquement la somme totale due.",
  },
];

const CATEGORIES = [
  {
    icon: Plane,
    name: "Transport",
    text: "Train, avion, taxi, parking — tous vos déplacements professionnels.",
  },
  {
    icon: UtensilsCrossed,
    name: "Repas",
    text: "Déjeuners et dîners d'affaires, restaurés en mission.",
  },
  {
    icon: BedDouble,
    name: "Hôtel",
    text: "Nuitées et hébergement lors de vos missions chez le client.",
  },
];

export default function Home() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grain opacity-60" aria-hidden />
        <div
          className="absolute -right-32 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-200/40 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-accent-400/15 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:py-28">
          {/* Copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Notes de frais · Consultants & Gestionnaires
            </span>

            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink-950 sm:text-6xl lg:text-7xl">
              Vos notes de frais,
              <span className="block text-brand-600">sans le papier.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ink-600">
              Note2Frais digitalise la saisie de vos dépenses professionnelles.
              Montant, catégorie, date et justificatif photo&nbsp;: tout est
              centralisé. En fin de mois, le gestionnaire dispose d'un
              récapitulatif filtré par consultant, somme totale due à l'appui.
            </p>

            <div className="mt-9">
              <AuthCTA />
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              <div>
                <dt className="text-2xl font-semibold text-ink-950">3</dt>
                <dd className="mt-1 text-xs text-ink-500">catégories clés</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold text-ink-950">€</dt>
                <dd className="mt-1 text-xs text-ink-500">calcul auto en euros</dd>
              </div>
              <div>
                <dt className="text-2xl font-semibold text-ink-950">2</dt>
                <dd className="mt-1 text-xs text-ink-500">rôles dédiés</dd>
              </div>
            </dl>
          </div>

          {/* Mockup */}
          <div className="relative animate-fade-in lg:pl-6">
            <div className="relative mx-auto max-w-md">
              {/* Floating receipt card */}
              <div className="surface-elevated relative z-20 rounded-3xl p-6 shadow-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={LOGO_URL}
                      alt=""
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-ink-200"
                    />
                    <span className="text-sm font-semibold text-ink-900">
                      Nouvelle note
                    </span>
                  </div>
                  <span className="rounded-full bg-pending/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-pending">
                    En attente
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                      Montant
                    </p>
                    <p className="mt-1 text-4xl font-semibold tracking-tight text-ink-950">
                      84,50&nbsp;€
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                    <UtensilsCrossed className="h-3.5 w-3.5" /> Repas
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl bg-paper px-3.5 py-3 text-sm text-ink-600">
                  <CalendarDays className="h-4 w-4 text-ink-400" />
                  14 mars 2025 · Déjeuner client
                </div>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-dashed border-ink-200 bg-cream px-3.5 py-3">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-ink-900 text-cream">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-ink-900">
                      ticket_dejeuner.jpg
                    </p>
                    <p className="text-ink-400">Justificatif joint</p>
                  </div>
                  <CheckCircle2 className="ml-auto h-5 w-5 text-brand-600" />
                </div>
              </div>

              {/* Floating total chip */}
              <div className="absolute -bottom-6 -left-6 z-30 hidden rounded-2xl bg-ink-950 px-5 py-4 text-cream shadow-lift sm:block">
                <p className="text-[10px] font-medium uppercase tracking-wide text-ink-400">
                  Total dû — Mars
                </p>
                <p className="mt-0.5 text-2xl font-semibold text-brand-400">
                  1 248,00&nbsp;€
                </p>
              </div>

              {/* Floating report chip */}
              <div className="absolute -right-4 -top-5 z-30 hidden rounded-2xl bg-white px-4 py-3 shadow-lift sm:flex sm:items-center sm:gap-2">
                <BarChart3 className="h-4 w-4 text-brand-600" />
                <span className="text-xs font-semibold text-ink-900">
                  Rapport mensuel
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="border-y border-ink-100 bg-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-sm text-ink-500 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 font-medium">
            <Euro className="h-4 w-4 text-brand-600" /> Montants en euros
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <CalendarDays className="h-4 w-4 text-brand-600" /> Période mensuelle
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4 text-brand-600" /> Accès par rôle
          </span>
          <span className="inline-flex items-center gap-2 font-medium">
            <Camera className="h-4 w-4 text-brand-600" /> Justificatif photo
          </span>
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
            Le fonctionnement
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
            Trois gestes, zéro friction.
          </h2>
          <p className="mt-4 text-lg text-ink-600">
            Du ticket froissé au remboursement calculé, Note2Frais supprime
            chaque étape manuelle.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="group relative surface-elevated rounded-3xl p-7 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="absolute right-6 top-6 text-5xl font-semibold text-ink-100">
                {i + 1}
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-ink-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Two roles ===== */}
      <section className="bg-ink-950 text-cream">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-400">
              Deux rôles, une plateforme
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Pensé pour qui saisit comme pour qui contrôle.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            {/* Consultant */}
            <div className="rounded-3xl border border-ink-800 bg-ink-900/60 p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-600 text-white">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cream">Consultant</h3>
                  <p className="text-xs text-ink-400">Rôle de saisie</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-ink-300">
                {[
                  "Ajoute une dépense avec montant, catégorie et date",
                  "Photographie et joint le justificatif",
                  "Suit le statut de chaque note (en attente, approuvée, refusée)",
                  "Consulte l'historique de ses dépenses",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/inscription"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-400 transition hover:text-brand-300"
              >
                Devenir consultant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Gestionnaire */}
            <div className="rounded-3xl border border-brand-800 bg-gradient-to-br from-brand-950 to-ink-900 p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-400 text-ink-950">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cream">Gestionnaire</h3>
                  <p className="text-xs text-brand-300">Rôle de consultation</p>
                </div>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-ink-200">
                {[
                  "Voit l'ensemble des notes de frais de l'équipe",
                  "Filtre le récapitulatif par consultant et par mois",
                  "Obtient la somme totale due, calculée automatiquement",
                  "Approuve, refuse ou ajuste les notes",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href="/connexion"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200"
              >
                Accéder au rapport
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Catégories de dépenses
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
              Tout ce que vous engagez en mission.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ink-500">
            Trois catégories couvrent l'essentiel des frais professionnels. Le
            calcul mensuel les regroupe toutes en une seule somme due.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="group surface-elevated overflow-hidden rounded-3xl p-7 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-paper text-brand-700 ring-1 ring-ink-100 transition group-hover:bg-brand-600 group-hover:text-white">
                <cat.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-ink-950">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                {cat.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-brand-600 px-8 py-16 text-center text-white sm:px-16">
          <div
            className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand-400/30 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-brand-800/40 blur-2xl"
            aria-hidden
          />
          <div className="relative">
            <Users className="mx-auto h-10 w-10 text-brand-100" />
            <h2 className="mx-auto mt-5 max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Prêt à arrêter de gérer vos frais sur tableur&nbsp;?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-brand-50">
              Créez votre compte consultant et saisissez votre première note de
              frais en moins de deux minutes.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/inscription"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-brand-700 shadow-lift transition hover:bg-brand-50"
              >
                Créer un compte
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 rounded-full border border-brand-300/60 bg-brand-700/40 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-brand-700/70"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
