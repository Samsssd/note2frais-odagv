import Link from "next/link";
import { Receipt, ShieldCheck, Mail } from "lucide-react";

const LOGO_URL =
  "https://d2w5g74r7hbhjx.cloudfront.net/app_b7abd1d2/branding/logo/9242b731fdec8e14mr0zqkv6.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-ink-100 bg-ink-950 text-ink-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src={LOGO_URL}
                alt="Note2Frais"
                className="h-9 w-9 rounded-xl object-cover ring-1 ring-ink-700"
              />
              <span className="text-[15px] font-semibold tracking-tight text-cream">
                Note<span className="text-brand-400">2</span>Frais
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-400">
              La gestion des notes de frais simplifiée pour les consultants.
              Saisissez vos dépenses, joignez vos justificatifs et laissez
              l'automatisation calculer les remboursements mensuels.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs text-ink-500">
              <ShieldCheck className="h-4 w-4 text-brand-400" />
              Données chiffrées · Accès par rôle
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-ink-300 transition hover:text-brand-400"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/depenses"
                  className="text-ink-300 transition hover:text-brand-400"
                >
                  Mes notes de frais
                </Link>
              </li>
              <li>
                <Link
                  href="/rapport"
                  className="text-ink-300 transition hover:text-brand-400"
                >
                  Rapport mensuel
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
              Compte
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/connexion"
                  className="text-ink-300 transition hover:text-brand-400"
                >
                  Se connecter
                </Link>
              </li>
              <li>
                <Link
                  href="/inscription"
                  className="text-ink-300 transition hover:text-brand-400"
                >
                  Créer un compte
                </Link>
              </li>
              <li className="flex items-center gap-2 pt-1 text-ink-500">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:contact@note2frais.app"
                  className="transition hover:text-brand-400"
                >
                  contact@note2frais.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row">
          <p className="flex items-center gap-2">
            <Receipt className="h-3.5 w-3.5 text-brand-500" />
            © {year} Note2Frais. Tous droits réservés.
          </p>
          <p className="text-ink-600">
            Conçu pour les consultants et gestionnaires.
          </p>
        </div>
      </div>
    </footer>
  );
}
