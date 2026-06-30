"use client";

import Link from "next/link";
import { ArrowRight, Receipt, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

/**
 * Auth-aware call-to-action block used on the home page. Renders a 200 shell
 * immediately: while the session is initializing it shows the logged-out CTAs.
 */
export default function AuthCTA() {
  const { user, isManager, initialized } = useAuthStore();
  const signedIn = initialized && !!user;

  if (signedIn) {
    return (
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Link
          href="/depenses"
          className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700"
        >
          <Receipt className="h-4 w-4" />
          Accéder à mes notes
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
        {isManager && (
          <Link
            href="/rapport"
            className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-cream px-6 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
          >
            <BarChart3 className="h-4 w-4" />
            Voir le rapport mensuel
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
      <Link
        href="/inscription"
        className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lift transition hover:bg-brand-700"
      >
        Créer un compte consultant
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/connexion"
        className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-cream px-6 py-3.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
      >
        J'ai déjà un compte
      </Link>
    </div>
  );
}
