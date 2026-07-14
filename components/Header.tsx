"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
  ScrollText,
  Home,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/keh-de-palerme", label: "Histoire", icon: ScrollText },
  { href: "/depenses", label: "La Carte", icon: UtensilsCrossed },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { profile, user, isManager, signOut, initialized } = useAuthStore();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const displayName =
    profile?.full_name || profile?.email || user?.email || "Mon compte";
  const roleLabel = isManager ? "Gestionnaire" : "Consultant";

  return (
    <>
      {/* Spacer to offset the floating header */}
      <div className="h-20" aria-hidden />

      <header className="fixed left-1/2 top-3 z-50 w-[calc(100%-1.5rem)] max-w-6xl -translate-x-1/2">
        <div
          className="flex h-14 items-center justify-between gap-4 rounded-[1.75rem] border border-[#c9a227]/20 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(26,22,18,0.85), rgba(15,13,11,0.8))",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(201,162,39,0.15), inset 0 -1px 1px rgba(0,0,0,0.3)",
          }}
        >
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 pl-1"
            onClick={() => setOpen(false)}
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-sm font-medium text-ink-950"
              style={{
                background: "linear-gradient(135deg, #c9a227, #e8c547)",
                boxShadow: "0 0 12px rgba(201,162,39,0.3)",
              }}
            >
              ❦
            </span>
            <span className="flex flex-col leading-none">
              <span
                className="text-[15px] font-medium tracking-tight text-cream"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Le Colisée
              </span>
              <span className="mt-0.5 text-[9px] font-light uppercase tracking-[0.14em] text-[#e8c547]/50">
                by Massimo · dal 1987
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-light tracking-wide transition-all duration-300",
                  isActive(href)
                    ? "bg-[#c9a227]/15 text-[#e8c547] shadow-[inset_0_1px_1px_rgba(201,162,39,0.2)]"
                    : "text-cream/50 hover:bg-cream/5 hover:text-cream",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} />
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth block (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            {initialized && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/depenses"
                  className="flex items-center gap-2.5 rounded-full border border-[#c9a227]/20 bg-ink-900/60 py-1.5 pl-1.5 pr-3.5 backdrop-blur transition hover:border-[#c9a227]/40"
                >
                  <span
                    className="grid h-7 w-7 place-items-center rounded-full text-xs font-medium text-ink-950"
                    style={{ background: "linear-gradient(135deg, #c9a227, #e8c547)" }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="max-w-[120px] truncate text-xs font-light text-cream">
                      {displayName}
                    </span>
                    <span className="mt-0.5 text-[10px] font-light uppercase tracking-wide text-[#e8c547]/70">
                      {roleLabel}
                    </span>
                  </span>
                </Link>
                <button
                  onClick={() => void signOut()}
                  title="Se déconnecter"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#c9a227]/20 bg-ink-900/60 text-cream/60 backdrop-blur transition hover:border-[#c9a227]/40 hover:text-[#e8c547]"
                >
                  <LogOut className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/connexion"
                  className="rounded-full px-4 py-2 text-sm font-light tracking-wide text-cream/60 transition hover:text-[#e8c547]"
                >
                  Se connecter
                </Link>
                <Link
                  href="/inscription"
                  className="rounded-full px-4 py-2 text-sm font-medium tracking-wide text-ink-950 transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #c9a227, #e8c547)",
                    boxShadow: "0 0 16px rgba(201,162,39,0.2)",
                  }}
                >
                  Réserver
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#c9a227]/20 bg-ink-900/60 text-cream backdrop-blur md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer — warm dark glass */}
        {open && (
          <div
            className="mt-2 rounded-3xl border border-[#c9a227]/20 p-4 backdrop-blur-2xl md:hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(26,22,18,0.92), rgba(15,13,11,0.88))",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 1px rgba(201,162,39,0.12)",
            }}
          >
            <nav className="flex flex-col gap-1">
              {NAV.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-light tracking-wide transition-all duration-300",
                    isActive(href)
                      ? "bg-[#c9a227]/15 text-[#e8c547]"
                      : "text-cream/50 hover:bg-cream/5 hover:text-cream",
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-[#c9a227]/10 pt-4">
              {initialized && user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="grid h-10 w-10 place-items-center rounded-full text-sm font-medium text-ink-950"
                      style={{ background: "linear-gradient(135deg, #c9a227, #e8c547)" }}
                    >
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-light text-cream"
                        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                      >
                        {displayName}
                      </span>
                      <span className="text-xs font-light text-[#e8c547]/70">{roleLabel}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      void signOut();
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#c9a227]/20 bg-ink-900/60 px-4 py-3 text-sm font-light text-cream/70 backdrop-blur"
                  >
                    <LogOut className="h-4 w-4" /> Se déconnecter
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/connexion"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-[#c9a227]/20 bg-ink-900/60 px-4 py-3 text-sm font-light text-cream backdrop-blur"
                  >
                    <UserRound className="h-4 w-4" /> Se connecter
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-ink-950"
                    style={{
                      background: "linear-gradient(135deg, #c9a227, #e8c547)",
                      boxShadow: "0 0 16px rgba(201,162,39,0.2)",
                    }}
                  >
                    Réserver <ChevronDown className="-rotate-90 h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}