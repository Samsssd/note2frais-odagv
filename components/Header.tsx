"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LogOut,
  Menu,
  X,
  Receipt,
  BarChart3,
  Home,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { cn } from "@/lib/utils";

const LOGO_URL =
  "https://d2w5g74r7hbhjx.cloudfront.net/app_b7abd1d2/branding/logo/9242b731fdec8e14mr0zqkv6.png";

const NAV = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/depenses", label: "Mes notes", icon: Receipt },
  { href: "/rapport", label: "Rapport", icon: BarChart3 },
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
    <header className="sticky top-0 z-50 border-b border-ink-100/80 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <img
            src={LOGO_URL}
            alt="Note2Frais"
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-ink-200/60 transition group-hover:ring-brand-400"
          />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-ink-950">
              Note<span className="text-brand-600">2</span>Frais
            </span>
            <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-400">
              Notes de frais
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
                "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition",
                isActive(href)
                  ? "bg-ink-900 text-cream"
                  : "text-ink-500 hover:bg-ink-100/70 hover:text-ink-900",
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
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
                className="flex items-center gap-2.5 rounded-full border border-ink-200/70 bg-cream py-1.5 pl-1.5 pr-3.5 transition hover:border-brand-300 hover:shadow-soft"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="flex flex-col leading-none">
                  <span className="max-w-[120px] truncate text-xs font-semibold text-ink-900">
                    {displayName}
                  </span>
                  <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-600">
                    {roleLabel}
                  </span>
                </span>
              </Link>
              <button
                onClick={() => void signOut()}
                title="Se déconnecter"
                className="grid h-9 w-9 place-items-center rounded-full border border-ink-200/70 text-ink-500 transition hover:border-refused/40 hover:bg-refused/5 hover:text-refused"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/connexion"
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition hover:text-ink-950"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200/70 text-ink-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-ink-100 bg-cream/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                  isActive(href)
                    ? "bg-ink-900 text-cream"
                    : "text-ink-600 hover:bg-ink-100",
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-ink-100 pt-4">
            {initialized && user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-ink-900">
                      {displayName}
                    </span>
                    <span className="text-xs text-brand-600">{roleLabel}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    void signOut();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-refused/30 bg-refused/5 px-4 py-3 text-sm font-semibold text-refused"
                >
                  <LogOut className="h-4 w-4" /> Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/connexion"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-ink-200 px-4 py-3 text-sm font-medium text-ink-700"
                >
                  <UserRound className="h-4 w-4" /> Se connecter
                </Link>
                <Link
                  href="/inscription"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Créer un compte <ChevronDown className="-rotate-90 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
