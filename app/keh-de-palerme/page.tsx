"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type Woman = {
  name: string;
  city: string;
  age: number;
  bio: string;
  passion: string;
  tags: string[];
  gradient: string;
  accent: string;
};

const SPANISH_WOMEN: Woman[] = [
  {
    name: "Sofía",
    city: "Madrid",
    age: 28,
    bio: "Architecte passionnée par le design moderne et les espaces lumineux.",
    passion: "Design d'intérieur",
    tags: ["Créative", "Madrilène", "Minimaliste"],
    gradient: "from-rose-300 via-red-500 to-orange-600",
    accent: "text-rose-300",
  },
  {
    name: "Carmen",
    city: "Barcelone",
    age: 32,
    bio: "Chef cuisinière qui réinvente les tapas traditionnelles.",
    passion: "Gastronomie",
    tags: ["Gourmande", "Barcelonaise", "Audacieuse"],
    gradient: "from-amber-200 via-orange-400 to-red-500",
    accent: "text-amber-300",
  },
  {
    name: "Elena",
    city: "Séville",
    age: 26,
    bio: "Danseuse de flamenco et professeure de mouvement.",
    passion: "Flamenco",
    tags: ["Artistique", "Sévillane", "Passionnée"],
    gradient: "from-red-400 via-rose-600 to-purple-700",
    accent: "text-red-300",
  },
  {
    name: "María",
    city: "Valence",
    age: 30,
    bio: "Ingénieure en technologies vertes et amoureuse de la mer.",
    passion: "Écologie",
    tags: ["Engagée", "Valencienne", "Marine"],
    gradient: "from-teal-300 via-emerald-400 to-cyan-600",
    accent: "text-emerald-300",
  },
  {
    name: "Lucía",
    city: "Bilbao",
    age: 27,
    bio: "Photographe voyageuse à la recherche de lumières dorées.",
    passion: "Photographie",
    tags: ["Voyageuse", "Bilbaïne", "Curieuse"],
    gradient: "from-indigo-300 via-purple-500 to-pink-500",
    accent: "text-purple-300",
  },
  {
    name: "Ana",
    city: "Grenade",
    age: 29,
    bio: "Historienne de l'art et guide dans les palais mauresques.",
    passion: "Histoire",
    tags: ["Cultivée", "Grenadine", "Rêveuse"],
    gradient: "from-orange-300 via-rose-500 to-red-700",
    accent: "text-orange-300",
  },
];

const CITIES = [
  "Toutes",
  "Madrid",
  "Barcelone",
  "Séville",
  "Valence",
  "Bilbao",
  "Grenade",
];

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
        active
          ? "bg-brand-600 text-white shadow-[0_0_24px_-6px_rgba(185,28,28,0.55)]"
          : "bg-ink-900/60 text-ink-300 ring-1 ring-ink-800 hover:bg-ink-800 hover:text-cream",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function StatCard({
  value,
  label,
  icon: Icon,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900/50 p-6 backdrop-blur-sm transition hover:border-brand-800/60 hover:bg-ink-900/70">
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-600/10 blur-2xl transition group-hover:bg-brand-600/20" />
      <Icon className="h-6 w-6 text-brand-500" />
      <p className="mt-4 text-3xl font-semibold tracking-tight text-cream">
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-400">{label}</p>
    </div>
  );
}

function ProfileCard({
  woman,
  isLiked,
  onToggleLike,
  index,
}: {
  woman: Woman;
  isLiked: boolean;
  onToggleLike: () => void;
  index: number;
}) {
  return (
    <article
      className="group relative animate-fade-up"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-ink-900/40 backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-brand-800/50 hover:bg-ink-900/60 hover:shadow-[0_24px_80px_-24px_rgba(185,28,28,0.35)]">
        {/* Abstract portrait */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <div
            className={[
              "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110",
              woman.gradient,
            ].join(" ")}
          />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-black/20 blur-2xl" />

          {/* Initial as artistic mark */}
          <div className="absolute left-6 top-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl font-bold text-white backdrop-blur-md ring-1 ring-white/20">
              {woman.name.charAt(0)}
            </span>
          </div>

          {/* Like */}
          <button
            onClick={onToggleLike}
            aria-label={isLiked ? "Retirer le like" : "Aimer"}
            className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-ink-950/40 text-white backdrop-blur-md transition hover:bg-ink-950/70 hover:scale-110 active:scale-95"
          >
            <Heart
              className={[
                "h-5 w-5 transition",
                isLiked ? "fill-brand-500 text-brand-500" : "text-white/80",
              ].join(" ")}
            />
          </button>

          {/* City badge */}
          <div className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-ink-950/50 px-3 py-1.5 text-xs font-medium text-cream backdrop-blur-md ring-1 ring-white/10">
            <MapPin className="h-3 w-3" />
            {woman.city}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-cream">
                {woman.name}
              </h2>
              <p className="mt-0.5 text-sm text-ink-400">
                {woman.age} ans · {woman.passion}
              </p>
            </div>
            {isLiked && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-brand-300">
                <Sparkles className="h-3 w-3" />
                Match
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            {woman.bio}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {woman.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ink-800/70 px-3 py-1 text-[11px] font-medium text-ink-300 ring-1 ring-ink-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cream py-3 text-sm font-semibold text-ink-950 transition hover:bg-brand-50 hover:shadow-lg active:scale-[0.98]">
            Dire hola
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function KehDePalermePage() {
  const [activeCity, setActiveCity] = useState("Toutes");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const filteredWomen = useMemo(() => {
    if (activeCity === "Toutes") return SPANISH_WOMEN;
    return SPANISH_WOMEN.filter((w) => w.city === activeCity);
  }, [activeCity]);

  const toggleLike = (name: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ink-950 text-cream">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-40 -top-40 h-[55rem] w-[55rem] rounded-full bg-brand-700/15 blur-[140px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed left-0 top-1/3 h-[45rem] w-[45rem] rounded-full bg-accent-500/8 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 right-1/4 h-[35rem] w-[35rem] rounded-full bg-purple-600/10 blur-[120px]"
        aria-hidden
      />

      {/* Hero */}
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-800/60 bg-brand-950/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            Rencontres · Espagne
          </span>

          <h1 className="mt-8 text-balance text-6xl font-semibold leading-[0.95] tracking-tighter text-transparent sm:text-8xl lg:text-9xl bg-gradient-to-br from-cream via-brand-200 to-brand-600 bg-clip-text">
            Keh de
            <br />
            Palerme
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-ink-400 sm:text-xl">
            Une galerie de profils espagnols aux personnalités affirmées. De
            Madrid à Grenade, laissez-vous porter par la chaleur ibérique.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#galery"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(185,28,28,0.5)] transition hover:bg-brand-700 hover:shadow-[0_16px_48px_-12px_rgba(185,28,28,0.6)] active:scale-95"
            >
              Explorer la galerie
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-800 bg-ink-900/60 px-5 py-3 text-xs font-medium text-ink-400 backdrop-blur-md">
              <Users className="h-4 w-4" />
              {SPANISH_WOMEN.length} profils sélectionnés
            </span>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-fade-in">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-ink-700 p-2">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500" />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section
        id="galery"
        className="sticky top-0 z-40 border-b border-ink-800/50 bg-ink-950/80 px-4 py-4 backdrop-blur-2xl sm:px-6 lg:px-8"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3">
          {CITIES.map((city) => (
            <FilterPill
              key={city}
              label={city}
              active={activeCity === city}
              onClick={() => setActiveCity(city)}
            />
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-500">
              Profils
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
              {activeCity === "Toutes"
                ? "Toutes les rencontres"
                : `À ${activeCity}`}
            </h2>
          </div>
          <p className="hidden text-sm text-ink-400 sm:block">
            {filteredWomen.length} résultat
            {filteredWomen.length > 1 ? "s" : ""}
          </p>
        </div>

        {filteredWomen.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWomen.map((woman, i) => (
              <ProfileCard
                key={woman.name}
                woman={woman}
                index={i}
                isLiked={liked.has(woman.name)}
                onToggleLike={() => toggleLike(woman.name)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink-800 bg-ink-900/30 py-24 text-center">
            <Compass className="h-12 w-12 text-ink-600" />
            <p className="mt-4 text-lg font-medium text-ink-300">
              Aucun profil trouvé
            </p>
            <p className="text-sm text-ink-500">
              Essayez une autre ville.
            </p>
          </div>
        )}
      </section>

      {/* Stats strip */}
      <section className="relative border-y border-ink-800/50 bg-ink-950/50 backdrop-blur-sm">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
          <StatCard
            value={String(SPANISH_WOMEN.length)}
            label="Profils uniques"
            icon={Users}
          />
          <StatCard
            value={String(new Set(SPANISH_WOMEN.map((w) => w.city)).size)}
            label="Villes explorées"
            icon={MapPin}
          />
          <StatCard
            value={`${Math.round(
              SPANISH_WOMEN.reduce((sum, w) => sum + w.age, 0) /
                SPANISH_WOMEN.length
            )} ans`}
            label="Âge moyen"
            icon={Star}
          />
          <StatCard
            value={String(liked.size)}
            label="Coup de cœur"
            icon={Heart}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-700 via-brand-800 to-ink-950 px-8 py-20 text-center sm:px-16 lg:py-28">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-ink-950/60 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <Heart className="mx-auto h-12 w-12 text-brand-200" />
            <h2 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-cream sm:text-5xl lg:text-6xl">
              Prêt à écrire votre histoire&nbsp;?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-brand-100/80">
              Parcourez les profils, envoyez un message et laissez la magie
              opérer.
            </p>
            <button className="group mt-10 inline-flex items-center gap-2 rounded-full bg-cream px-9 py-4 text-sm font-semibold text-brand-800 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.4)] transition hover:bg-white hover:scale-105 active:scale-95">
              Commencer l&apos;aventure
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}