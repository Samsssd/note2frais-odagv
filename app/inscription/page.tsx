"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

const LOGO_URL =
  "https://d2w5g74r7hbhjx.cloudfront.net/app_b7abd1d2/branding/logo/9242b731fdec8e14mr0zqkv6.png";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, user, initialized } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && user) router.replace("/depenses");
  }, [initialized, user, router]);

  const passwordStrong = password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    router.replace("/depenses");
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="absolute inset-0 grain opacity-50" aria-hidden />
      <div
        className="absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Right (form) on mobile-first, left editorial on desktop */}
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Compte consultant
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink-950">
              Enregistrez vos dépenses
              <span className="block text-brand-600">en deux minutes.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
              Créez votre compte pour ajouter vos notes de frais, joindre vos
              justificatifs et suivre vos remboursements. Vous êtes
              gestionnaire&nbsp;? Connectez-vous pour accéder au rapport mensuel.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-500">
              {[
                "Inscription immédiate, sans étape de confirmation",
                "Rôle consultant par défaut (saisie des frais)",
                "Accès au rapport pour les gestionnaires",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <CheckCircle2 className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Form card */}
          <div className="mx-auto w-full max-w-md">
            <div className="surface-elevated rounded-3xl p-8 sm:p-10">
              <div className="flex items-center gap-2.5">
                <img
                  src={LOGO_URL}
                  alt="Note2Frais"
                  className="h-10 w-10 rounded-xl object-cover ring-1 ring-ink-200"
                />
                <span className="text-lg font-semibold tracking-tight text-ink-950">
                  Note<span className="text-brand-600">2</span>Frais
                </span>
              </div>

              <h2 className="mt-7 text-2xl font-semibold tracking-tight text-ink-950">
                Créer un compte
              </h2>
              <p className="mt-1.5 text-sm text-ink-500">
                Rôle consultant — pour saisir et suivre vos notes de frais.
              </p>

              {error && (
                <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-refused/20 bg-refused/5 px-4 py-3 text-sm text-refused">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"
                  >
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Camille Martin"
                      className="w-full rounded-xl border border-ink-200 bg-paper py-3 pl-10 pr-4 text-sm text-ink-950 transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"
                  >
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@entreprise.fr"
                      className="w-full rounded-xl border border-ink-200 bg-paper py-3 pl-10 pr-4 text-sm text-ink-950 transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Au moins 6 caractères"
                      className="w-full rounded-xl border border-ink-200 bg-paper py-3 pl-10 pr-11 text-sm text-ink-950 transition placeholder:text-ink-300 focus:border-brand-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 transition hover:text-ink-700"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <p
                      className={`mt-1.5 text-xs ${
                        passwordStrong ? "text-brand-700" : "text-ink-400"
                      }`}
                    >
                      {passwordStrong
                        ? "Mot de passe valide."
                        : "6 caractères minimum."}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting || !passwordStrong}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création du compte…
                    </>
                  ) : (
                    <>
                      Créer mon compte
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-500">
                Déjà inscrit&nbsp;?{" "}
                <Link
                  href="/connexion"
                  className="font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
