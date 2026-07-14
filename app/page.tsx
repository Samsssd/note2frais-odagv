"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   Revy — La marketplace des meilleures marques upcycling
   ═══════════════════════════════════════════════════════════ */

/* ── Palette ─────────────────────────────────────────────── */
const CREAM = "#F8F5F0";
const CREAM_DARK = "#EDE7DC";
const INK = "#1A1A17";
const INK_LIGHT = "#26261F";
const SAGE = "#6B7F5E";
const SAGE_LIGHT = "#A8B89E";
const SAGE_DARK = "#4A5D3F";
const TERRA = "#C27B5C";
const TERRA_LIGHT = "#D4A088";
const TERRA_DARK = "#A05A3C";
const SAND = "#E8DCC8";
const MUTED = "#8B8B7E";

/* ── Données ─────────────────────────────────────────────── */
const HERO_TAGS = [
  "Vêtements",
  "Sacs & Accessoires",
  "Maison & Déco",
  "Bijoux",
  "Chaussures",
  "Enfant",
];

const MARQUEE_BRANDS = [
  "Maison Récup",
  "Atelier René",
  "Filament",
  "Séconde Peau",
  "Garage Textile",
  "L'Atelier Botanique",
  "Tissu Re-né",
  "Récup' Studio",
];

const BRANDS = [
  {
    name: "Maison Récup",
    city: "Paris",
    desc: "Vêtements rétro reconstruits à partir de textiles anciens.",
    products: 142,
    gradient: "linear-gradient(135deg, #8B9D7E 0%, #4A5D3F 100%)",
    emoji: "🧥",
    tag: "Vêtements",
  },
  {
    name: "Atelier René",
    city: "Lyon",
    desc: "Sacs et accessoires en bâches publicitaires récupérées.",
    products: 86,
    gradient: "linear-gradient(135deg, #D4A088 0%, #A05A3C 100%)",
    emoji: "👜",
    tag: "Accessoires",
  },
  {
    name: "Filament",
    city: "Nantes",
    desc: "Décoration d'intérieur à partir de châles et rideaux vintage.",
    products: 64,
    gradient: "linear-gradient(135deg, #E8DCC8 0%, #A8B89E 100%)",
    emoji: "🛋️",
    tag: "Maison",
  },
  {
    name: "Séconde Peau",
    city: "Bordeaux",
    desc: "Vêtements transformés et teints avec des pigments naturels.",
    products: 113,
    gradient: "linear-gradient(135deg, #A8B89E 0%, #6B7F5E 100%)",
    emoji: "👗",
    tag: "Vêtements",
  },
  {
    name: "Garage Textile",
    city: "Marseille",
    desc: "Sweats et hoodies upcyclés à partir de fripes américaines.",
    products: 97,
    gradient: "linear-gradient(135deg, #2A2A25 0%, #4A5D3F 100%)",
    emoji: "🧵",
    tag: "Streetwear",
  },
  {
    name: "L'Atelier Botanique",
    city: "Annecy",
    desc: "Bijoux et accessoires végétaux fabriqués à la main.",
    products: 58,
    gradient: "linear-gradient(135deg, #C27B5C 0%, #E8DCC8 100%)",
    emoji: "✨",
    tag: "Bijoux",
  },
];

const CATEGORIES = [
  { name: "Vêtements", icon: "👗", count: "1 240 produits", gradient: "linear-gradient(135deg, #A8B89E, #6B7F5E)" },
  { name: "Sacs & Accessoires", icon: "👜", count: "680 produits", gradient: "linear-gradient(135deg, #D4A088, #C27B5C)" },
  { name: "Maison & Déco", icon: "🛋️", count: "420 produits", gradient: "linear-gradient(135deg, #E8DCC8, #A8B89E)" },
  { name: "Bijoux", icon: "✨", count: "310 produits", gradient: "linear-gradient(135deg, #C27B5C, #D4A088)" },
  { name: "Chaussures", icon: "👟", count: "180 produits", gradient: "linear-gradient(135deg, #4A5D3F, #6B7F5E)" },
  { name: "Enfant", icon: "🧒", count: "150 produits", gradient: "linear-gradient(135deg, #E8DCC8, #D4A088)" },
];

const PRODUCTS = [
  { name: "Veste en jean reconstituée", brand: "Maison Récup", price: 89, gradient: "linear-gradient(135deg, #8B9D7E, #4A5D3F)", tag: "Jean ancien", emoji: "🧥" },
  { name: "Sac en bâche recyclée", brand: "Atelier René", price: 65, gradient: "linear-gradient(135deg, #D4A088, #A05A3C)", tag: "Bâche pub", emoji: "👜" },
  { name: "Plaid en châle vintage", brand: "Filament", price: 120, gradient: "linear-gradient(135deg, #E8DCC8, #A8B89E)", tag: "Châle laine", emoji: "🧶" },
  { name: "Robe teintée nature", brand: "Séconde Peau", price: 95, gradient: "linear-gradient(135deg, #A8B89E, #6B7F5E)", tag: "Coton bio", emoji: "👗" },
  { name: "Hoodie upcyclé", brand: "Garage Textile", price: 70, gradient: "linear-gradient(135deg, #2A2A25, #4A5D3F)", tag: "Fripe US", emoji: "🧵" },
  { name: "Collier végétal", brand: "L'Atelier Botanique", price: 45, gradient: "linear-gradient(135deg, #C27B5C, #E8DCC8)", tag: "Résine naturelle", emoji: "✨" },
  { name: "Pantalon cargo reconstitué", brand: "Maison Récup", price: 110, gradient: "linear-gradient(135deg, #6B7F5E, #2A2A25)", tag: "Toile ancienne", emoji: "👖" },
  { name: "Chapeau feutré recyclé", brand: "Filament", price: 55, gradient: "linear-gradient(135deg, #D4A088, #E8DCC8)", tag: "Feutre récup", emoji: "🎩" },
];

const STEPS = [
  { num: "01", icon: "🔍", title: "Explore les marques", desc: "Découvre des marques qui transforment l'ancien en pièces désirables." },
  { num: "02", icon: "🛍️", title: "Choisis tes pièces", desc: "Sélectionne des produits uniques, faits main et durables." },
  { num: "03", icon: "🌱", title: "Achète en conscience", desc: "Soutiens l'économie circulaire à chaque achat." },
];

const STATS = [
  { value: "120+", label: "Marques upcycling" },
  { value: "3 000+", label: "Produits uniques" },
  { value: "12 t", label: "Textile sauvé" },
  { value: "100%", label: "Fait main" },
];

/* ── Reveal on scroll ────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ── Like button ─────────────────────────────────────────── */
function LikeButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked(!liked);
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110"
      style={{
        background: liked ? "rgba(194,123,92,0.9)" : "rgba(255,255,255,0.85)",
      }}
      aria-label="Ajouter aux favoris"
    >
      <span className={`text-base transition-transform duration-300 ${liked ? "scale-110" : ""}`}>
        {liked ? "❤️" : "🤍"}
      </span>
    </button>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="overflow-hidden" style={{ background: CREAM }}>
      {/* ══════ HERO ══════ */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:pt-24">
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute left-[-10%] top-[5%] h-[30rem] w-[30rem] rounded-full opacity-25 blur-3xl"
            style={{ background: `radial-gradient(circle, ${SAGE_LIGHT}, transparent 70%)` }}
          />
          <div
            className="absolute right-[-5%] top-[10%] h-[25rem] w-[25rem] rounded-full opacity-20 blur-3xl"
            style={{ background: `radial-gradient(circle, ${TERRA_LIGHT}, transparent 70%)` }}
          />
          <div
            className="absolute bottom-[-10%] left-[30%] h-[20rem] w-[20rem] rounded-full opacity-15 blur-3xl"
            style={{ background: `radial-gradient(circle, ${SAND}, transparent 70%)` }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div
            className="rvy-fade-up mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{ borderColor: `${SAGE}40`, background: `${SAGE}10`, animationDelay: "0ms" }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: SAGE }} />
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: SAGE_DARK }}>
              120+ marques upcycling · Nouveau
            </span>
          </div>

          {/* Headline */}
          <h1
            className="rvy-fade-up text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ color: INK, animationDelay: "100ms" }}
          >
            Le meilleur de
            <br />
            <span style={{ color: SAGE_DARK }}>l&apos;upcycling</span>, en
            <br />
            un seul endroit.
          </h1>

          {/* Subtext */}
          <p
            className="rvy-fade-up mx-auto mt-8 max-w-xl text-lg font-light leading-relaxed sm:text-xl"
            style={{ color: MUTED, animationDelay: "200ms" }}
          >
            Découvre des marques uniques qui transforment l&apos;ancien en pièces
            désirables. Mode circulaire, esthétique intemporelle.
          </p>

          {/* Search bar */}
          <div
            className="rvy-fade-up mx-auto mt-10 flex max-w-2xl items-center gap-2 rounded-full border bg-white p-2 shadow-lg sm:p-2.5"
            style={{
              borderColor: `${INK}10`,
              boxShadow: `0 8px 32px ${INK}08`,
              animationDelay: "300ms",
            }}
          >
            <span className="pl-3 text-lg sm:pl-4" style={{ color: MUTED }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Rechercher une marque, un produit, une pièce…"
              className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none sm:text-base"
              style={{ color: INK }}
            />
            <button
              className="shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:opacity-90 sm:px-6 sm:py-3 sm:text-sm"
              style={{ background: INK }}
            >
              Rechercher
            </button>
          </div>

          {/* Tags */}
          <div
            className="rvy-fade-up mt-6 flex flex-wrap items-center justify-center gap-2"
            style={{ animationDelay: "400ms" }}
          >
            <span className="text-sm font-medium" style={{ color: MUTED }}>
              Populaire :
            </span>
            {HERO_TAGS.map((tag) => (
              <button
                key={tag}
                className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105"
                style={{ borderColor: `${INK}15`, color: INK }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div
            className="rvy-fade-up mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4"
            style={{ borderColor: `${INK}10`, animationDelay: "500ms" }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/60 p-5 text-center backdrop-blur-sm sm:p-6"
              >
                <div
                  className="text-2xl font-bold sm:text-4xl"
                  style={{ color: SAGE_DARK }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-2 text-[10px] font-medium uppercase tracking-wider sm:text-xs"
                  style={{ color: MUTED }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MARQUEE ══════ */}
      <section className="overflow-hidden py-6" style={{ background: INK }}>
        <div className="flex w-max" style={{ animation: "rvy-marquee 30s linear infinite" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex whitespace-nowrap" aria-hidden={copy === 1}>
              {MARQUEE_BRANDS.map((name, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="mx-6 text-xl font-bold uppercase tracking-wider sm:mx-8 sm:text-2xl"
                  style={{ color: i % 2 === 0 ? CREAM : SAGE_LIGHT }}
                >
                  {name}
                  <span className="ml-6 sm:ml-8" style={{ color: TERRA }}>·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURED BRANDS ══════ */}
      <section id="marques" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p
                  className="mb-3 text-sm font-semibold uppercase tracking-widest"
                  style={{ color: SAGE_DARK }}
                >
                  Marques en vedette
                </p>
                <h2
                  className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: INK }}
                >
                  Celles qui transforment
                  <br />
                  l&apos;ancien en <span style={{ color: TERRA }}>désirable</span>
                </h2>
              </div>
              <button
                className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ borderColor: `${INK}15`, color: INK }}
              >
                Voir toutes les marques
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BRANDS.map((brand, i) => (
              <Reveal key={brand.name} delay={i * 80}>
                <article
                  className="group cursor-pointer overflow-hidden rounded-3xl border bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  style={{ borderColor: `${INK}08`, boxShadow: `0 4px 24px ${INK}04` }}
                >
                  {/* Visual header */}
                  <div className="relative h-56 overflow-hidden" style={{ background: brand.gradient }}>
                    {/* Decorative circles */}
                    <div
                      className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
                      style={{ background: "white" }}
                    />
                    <div
                      className="absolute -bottom-12 -left-4 h-40 w-40 rounded-full opacity-5"
                      style={{ background: "white" }}
                    />
                    {/* Emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-60">
                      {brand.emoji}
                    </div>
                    {/* Tags */}
                    <div
                      className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                      style={{ color: INK }}
                    >
                      {brand.tag}
                    </div>
                    <div
                      className="absolute bottom-4 right-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                      style={{ color: INK }}
                    >
                      {brand.city}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold tracking-tight" style={{ color: INK }}>
                      {brand.name}
                    </h3>
                    <p className="mt-2 text-sm font-light leading-relaxed" style={{ color: MUTED }}>
                      {brand.desc}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: SAGE_DARK }}
                      >
                        {brand.products} produits
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 group-hover:gap-2"
                        style={{ color: INK }}
                      >
                        Découvrir <span>→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CATEGORIES ══════ */}
      <section
        id="categories"
        className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8"
        style={{ background: CREAM_DARK }}
      >
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-widest"
                style={{ color: SAGE_DARK }}
              >
                Catégories
              </p>
              <h2
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
                style={{ color: INK }}
              >
                Explore par <span style={{ color: TERRA }}>univers</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 70}>
                <button
                  className="group relative h-40 w-full overflow-hidden rounded-2xl text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                  style={{ background: cat.gradient }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 transition-all duration-500 group-hover:scale-150"
                    style={{ background: "white" }}
                  />
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 transition-all duration-500 group-hover:scale-125 group-hover:opacity-50">
                    {cat.icon}
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Text */}
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                    <p className="mt-1 text-xs font-medium text-white/80">{cat.count}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TRENDING PRODUCTS ══════ */}
      <section id="produits" className="scroll-mt-20 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p
                  className="mb-3 text-sm font-semibold uppercase tracking-widest"
                  style={{ color: SAGE_DARK }}
                >
                  Tendance
                </p>
                <h2
                  className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
                  style={{ color: INK }}
                >
                  Les pièces <span style={{ color: TERRA }}>du moment</span>
                </h2>
              </div>
              <button
                className="group inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{ borderColor: `${INK}15`, color: INK }}
              >
                Voir tout
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((product, i) => (
              <Reveal key={product.name} delay={i * 60}>
                <article
                  className="group cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  style={{ borderColor: `${INK}08` }}
                >
                  {/* Image area */}
                  <div className="relative aspect-square overflow-hidden" style={{ background: product.gradient }}>
                    {/* Decorative circles */}
                    <div
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
                      style={{ background: "white" }}
                    />
                    {/* Emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 transition-all duration-500 group-hover:scale-125 group-hover:opacity-50">
                      {product.emoji}
                    </div>
                    {/* Upcycled badge */}
                    <div
                      className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm"
                      style={{ background: "rgba(0,0,0,0.45)" }}
                    >
                      ⚡ {product.tag}
                    </div>
                    {/* Like button */}
                    <div className="absolute right-3 top-3">
                      <LikeButton />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span
                        className="rounded-full bg-white/90 px-5 py-2.5 text-xs font-semibold backdrop-blur-sm"
                        style={{ color: INK }}
                      >
                        Voir le produit →
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider" style={{ color: MUTED }}>
                      {product.brand}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold leading-snug" style={{ color: INK }}>
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-bold" style={{ color: SAGE_DARK }}>
                        {product.price} €
                      </span>
                      <span className="text-xs" style={{ color: MUTED }}>
                        Pièce unique
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="px-4 py-24 sm:px-6 lg:px-8" style={{ background: INK }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-16 text-center">
              <p
                className="mb-3 text-sm font-semibold uppercase tracking-widest"
                style={{ color: SAGE_LIGHT }}
              >
                Comment ça marche
              </p>
              <h2
                className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
                style={{ color: CREAM }}
              >
                Trois étapes vers
                <br />
                une mode <span style={{ color: TERRA_LIGHT }}>circulaire</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <div className="relative text-center">
                  {/* Connecting line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[60%] top-8 hidden h-px w-[80%] md:block"
                      style={{
                        background: `linear-gradient(to right, ${SAGE}40, transparent)`,
                      }}
                    />
                  )}
                  {/* Icon */}
                  <div
                    className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
                    style={{ background: INK_LIGHT, border: `1px solid ${SAGE}30` }}
                  >
                    {step.icon}
                    <span
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                      style={{ background: TERRA, color: INK }}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: CREAM }}>
                    {step.title}
                  </h3>
                  <p
                    className="mx-auto mt-3 max-w-xs text-sm font-light leading-relaxed"
                    style={{ color: `${CREAM}80` }}
                  >
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ MANIFESTO ══════ */}
      <section className="px-4 py-32 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 text-5xl" style={{ color: `${SAGE}60` }} aria-hidden>
              ❝
            </div>
            <blockquote
              className="text-3xl font-light leading-[1.4] tracking-tight sm:text-4xl md:text-5xl"
              style={{ color: INK }}
            >
              Chaque achat est un vote pour le monde
              <br />
              dans lequel tu veux <span style={{ color: TERRA, fontStyle: "italic" }}>vivre</span>.
            </blockquote>
            <div
              className="mx-auto mt-10 h-px w-24"
              style={{ background: `linear-gradient(to right, transparent, ${SAGE}, transparent)` }}
            />
            <p
              className="mt-8 text-sm font-medium uppercase tracking-widest"
              style={{ color: MUTED }}
            >
              Manifeste Revy
            </p>
          </div>
        </Reveal>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <Reveal>
          <div
            className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-12 text-center sm:p-16"
            style={{ background: `linear-gradient(135deg, ${SAGE_DARK}, ${SAGE})` }}
          >
            {/* Decorative circles */}
            <div
              className="pointer-events-none absolute right-[-5%] top-[-10%] h-40 w-40 rounded-full opacity-10"
              style={{ background: "white" }}
            />
            <div
              className="pointer-events-none absolute bottom-[-10%] left-[-5%] h-32 w-32 rounded-full opacity-10"
              style={{ background: "white" }}
            />
            <h2
              className="relative text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              style={{ color: CREAM }}
            >
              Rejoins la communauté
              <br />
              <span style={{ color: TERRA_LIGHT }}>Revy</span>
            </h2>
            <p
              className="relative mx-auto mt-6 max-w-md text-lg font-light"
              style={{ color: `${CREAM}90` }}
            >
              Sois informé des nouvelles marques, pièces uniques et drops
              exclusifs.
            </p>

            {/* Newsletter */}
            <div className="relative mx-auto mt-10 flex max-w-md flex-col items-center gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="ton@email.com"
                className="w-full flex-1 rounded-full bg-white/95 px-6 py-4 text-base outline-none"
                style={{ color: INK }}
              />
              <Link
                href="/inscription"
                className="w-full rounded-full px-8 py-4 text-center text-base font-semibold transition-all duration-300 hover:scale-105 sm:w-auto"
                style={{ background: TERRA, color: CREAM }}
              >
                S&apos;inscrire
              </Link>
            </div>
            <p className="relative mt-4 text-xs font-light" style={{ color: `${CREAM}60` }}>
              Pas de spam. Que des belles choses. Désinscription en un clic.
            </p>

            {/* Quick links */}
            <div className="relative mt-12 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/inscription"
                className="text-sm font-medium underline-offset-4 hover:underline"
                style={{ color: CREAM }}
              >
                Créer un compte
              </Link>
              <span style={{ color: `${CREAM}30` }}>·</span>
              <Link
                href="/connexion"
                className="text-sm font-medium underline-offset-4 hover:underline"
                style={{ color: CREAM }}
              >
                Se connecter
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="px-4 py-16 sm:px-6 lg:px-8" style={{ background: INK }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-bold" style={{ color: CREAM }}>
                Revy
              </h3>
              <p
                className="mt-3 text-sm font-light leading-relaxed"
                style={{ color: `${CREAM}60` }}
              >
                La marketplace qui donne une seconde vie au textile.
              </p>
            </div>
            {/* Links */}
            <div>
              <h4
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: SAGE_LIGHT }}
              >
                Explorer
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#marques"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Marques
                  </a>
                </li>
                <li>
                  <a
                    href="#categories"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Catégories
                  </a>
                </li>
                <li>
                  <a
                    href="#produits"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Produits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: SAGE_LIGHT }}
              >
                À propos
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Notre mission
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Devenir vendeur
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4
                className="mb-4 text-xs font-semibold uppercase tracking-widest"
                style={{ color: SAGE_LIGHT }}
              >
                Compte
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/inscription"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    S&apos;inscrire
                  </Link>
                </li>
                <li>
                  <Link
                    href="/connexion"
                    className="text-sm font-light transition-colors hover:text-white"
                    style={{ color: `${CREAM}70` }}
                  >
                    Se connecter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row"
            style={{ borderColor: `${CREAM}10` }}
          >
            <p className="text-xs font-light" style={{ color: `${CREAM}40` }}>
              © 2025 Revy — Fait avec ♻️ pour la planète
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs font-light transition-colors hover:text-white"
                style={{ color: `${CREAM}50` }}
              >
                CGV
              </a>
              <a
                href="#"
                className="text-xs font-light transition-colors hover:text-white"
                style={{ color: `${CREAM}50` }}
              >
                Confidentialité
              </a>
              <a
                href="#"
                className="text-xs font-light transition-colors hover:text-white"
                style={{ color: `${CREAM}50` }}
              >
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════ Animations ══════ */}
      <style dangerouslySetInnerHTML={{
        __html: `
          html { scroll-behavior: smooth; }
          @keyframes rvy-marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes rvy-fade-up {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .rvy-fade-up {
            opacity: 0;
            animation: rvy-fade-up 0.9s ease-out both;
          }
        `
      }} />
    </main>
  );
}