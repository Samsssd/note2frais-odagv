"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type UserRow } from "@/lib/supabase/tables";

interface UsersState {
  consultants: UserRow[];
  managers: UserRow[];
  all: UserRow[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  getUserById: (id: string | null | undefined) => UserRow | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  consultants: [],
  managers: [],
  all: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from(TABLES.users)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      set({
        consultants: [],
        managers: [],
        all: [],
        loading: false,
        error: error.message,
      });
      return;
    }

    const all = (data as UserRow[]) ?? [];
    set({
      all,
      consultants: all.filter((u) => u.role !== "admin"),
      managers: all.filter((u) => u.role === "admin"),
      loading: false,
    });
  },

  getUserById: (id) => {
    if (!id) return undefined;
    return get().all.find((u) => u.id === id);
  },
}));
