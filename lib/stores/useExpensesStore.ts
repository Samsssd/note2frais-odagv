"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type ExpenseRow } from "@/lib/supabase/tables";
import { useAuthStore } from "./useAuthStore";

interface ExpensesState {
  items: ExpenseRow[];
  loading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
}

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  loading: false,
  error: null,

  fetchExpenses: async () => {
    set({ loading: true, error: null });
    const { profile } = useAuthStore.getState();
    const isManager = profile?.role === "admin";
    const userId = useAuthStore.getState().user?.id;

    // Consultants see only their own expenses; managers see everyone's.
    let query = supabase
      .from(TABLES.reviews)
      .select("*")
      .order("expense_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (!isManager && userId) {
      query = query.eq("user_id", userId);
    } else if (!isManager && !userId) {
      // No user yet — show nothing rather than everyone's data.
      set({ items: [], loading: false });
      return;
    }

    const { data, error } = await query;
    if (error) {
      set({ items: [], loading: false, error: error.message });
      return;
    }
    set({ items: (data as ExpenseRow[]) ?? [], loading: false });
  },
}));
