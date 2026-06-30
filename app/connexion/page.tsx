"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

const LOGO_URL =
  "https://d2w5g74r7hbhjx.cloudfront.net/app_b7abd1d2/branding/logo/9242b731fdec8e14mr0zqkv6.png";

export default function SignInPage() {
  const router = useRouter();
  const { signIn, user, initialized } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, send to the app.
  useEffect(() => {
    if (initialized && user) router.replace("/depenses");
  }, [initialized, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
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
        className="absolute -right-32 top-0 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — editorial */}
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              Espace consultant & gestionnaire
            </span>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-ink-950">
              Reprenez la main sur
              <span className="block text-brand-600">vos notes de frais.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-600">
              Connectez-vous pour saisir une nouvelle dépense, suivre le statut
              de vos notes ou consulter le rapport mensuel.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-ink-500">
              {[
                "Justificatifs photo centralisés",
                "Statut en temps réel (en attente, approuvé, refusé)",
                "Rapport mensuel filtré par consultant",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-100 text-brand-700">
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form card */}
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
                Connexion
              </h2>
              <p className="mt-1.5 text-sm text-ink-500">
                Entrez vos identifiants pour accéder à votre espace.
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
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connexion…
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-ink-500">
                Pas encore de compte&nbsp;?{" "}
                <Link
                  href="/inscription"
                  className="font-semibold text-brand-700 transition hover:text-brand-800"
                >
                  Créer un compte consultant
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
