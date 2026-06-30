"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";

/**
 * Initializes the Supabase auth session on mount and keeps the profile row
 * in sync. Children render immediately; owned-data pages guard on the store's
 * `initialized` / `loading` flags.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return <>{children}</>;
}
