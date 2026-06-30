"use client";

import { create } from "zustand";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type UserRow } from "@/lib/supabase/tables";

interface AuthState {
  user: { id: string; email: string | null } | null;
  session: import("@supabase/supabase-js").Session | null;
  profile: UserRow | null;
  loading: boolean;
  error: string | null;
  isManager: boolean;
  initialized: boolean;

  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  init: () => Promise<void>;
}

/**
 * Role mapping:
 *   'member' → Consultant (saisie des notes de frais)
 *   'admin'  → Gestionnaire (consultation & approbation)
 */

const DEFAULT_CATEGORIES = ["Transport", "Repas", "Hôtel"];

// Upsert the profile row and, if needed, seed the default categories so the
// consultant immediately has a category to pick when creating an expense.
async function ensureProfileAndDefaults(
  userId: string,
  email: string,
  fullName?: string,
): Promise<UserRow | null> {
  const { data: existing } = await supabase
    .from(TABLES.users)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    // Refresh email / name in case the auth account changed.
    const needsUpdate =
      existing.email !== email ||
      (fullName && existing.full_name !== fullName);
    if (needsUpdate) {
      await supabase
        .from(TABLES.users)
        .update({ email, full_name: fullName ?? existing.full_name })
        .eq("id", userId);
      return { ...existing, email, full_name: fullName ?? existing.full_name };
    }
    return existing as UserRow;
  }

  const { data: inserted, error } = await supabase
    .from(TABLES.users)
    .insert({
      id: userId,
      email,
      full_name: fullName ?? null,
      role: "member",
      total_due_eur: 0,
    })
    .select("*")
    .single();

  if (error) {
    // Race condition: another tab inserted it. Fetch instead.
    const { data: retry } = await supabase
      .from(TABLES.users)
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return retry as UserRow | null;
  }

  // Seed default categories on first profile creation if table is empty.
  const { count } = await supabase
    .from(TABLES.categories)
    .select("*", { count: "exact", head: true });
  if (count === 0) {
    await supabase.from(TABLES.categories).insert(
      DEFAULT_CATEGORIES.map((name) => ({
        name,
        description: null,
        image_url: null,
      })),
    );
  }

  return (inserted as UserRow) ?? null;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  error: null,
  isManager: false,
  initialized: false,

  refreshProfile: async () => {
    const u = get().user;
    if (!u) return;
    const { data } = await supabase
      .from(TABLES.users)
      .select("*")
      .eq("id", u.id)
      .maybeSingle();
    const profile = (data as UserRow | null) ?? null;
    set({ profile, isManager: profile?.role === "admin" });
  },

  init: async () => {
    if (get().initialized) return;
    set({ initialized: true, loading: true });

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (session?.user) {
      const user = { id: session.user.id, email: session.user.email ?? null };
      const profile = await ensureProfileAndDefaults(
        user.id,
        user.email ?? "",
        (session.user.user_metadata?.full_name as string) ?? undefined,
      );
      set({
        user,
        session,
        profile,
        isManager: profile?.role === "admin",
        loading: false,
      });
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, newSession: Session | null) => {
      if (newSession?.user) {
        const user = {
          id: newSession.user.id,
          email: newSession.user.email ?? null,
        };
        const profile = await ensureProfileAndDefaults(
          user.id,
          user.email ?? "",
          (newSession.user.user_metadata?.full_name as string) ?? undefined,
        );
        set({
          user,
          session: newSession,
          profile,
          isManager: profile?.role === "admin",
          loading: false,
        });
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          isManager: false,
        });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }
    if (data.user) {
      const user = { id: data.user.id, email: data.user.email ?? email };
      const profile = await ensureProfileAndDefaults(user.id, user.email);
      set({
        user,
        session: data.session,
        profile,
        isManager: profile?.role === "admin",
        loading: false,
      });
    }
    return { error: null };
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      set({ loading: false, error: error.message });
      return { error: error.message };
    }

    // Email confirmation is disabled — signUp returns an active session.
    // Defensive fallback: if no session came back, sign in directly.
    if (data.session?.user) {
      const user = {
        id: data.session.user.id,
        email: data.session.user.email ?? email,
      };
      const profile = await ensureProfileAndDefaults(
        user.id,
        user.email,
        fullName,
      );
      set({
        user,
        session: data.session,
        profile,
        isManager: profile?.role === "admin",
        loading: false,
      });
      return { error: null };
    }

    // Fallback: try to sign in with the same credentials.
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !signInData.user) {
      set({ loading: false, error: signInError?.message ?? "Inscription échouée." });
      return { error: signInError?.message ?? "Inscription échouée." };
    }
    const user = {
      id: signInData.user.id,
      email: signInData.user.email ?? email,
    };
    const profile = await ensureProfileAndDefaults(user.id, user.email, fullName);
    set({
      user,
      session: signInData.session,
      profile,
      isManager: profile?.role === "admin",
      loading: false,
    });
    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({
      user: null,
      session: null,
      profile: null,
      isManager: false,
      error: null,
    });
  },
}));
