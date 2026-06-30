"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase/client";
import { TABLES, type CategoryRow } from "@/lib/supabase/tables";

const DEFAULT_CATEGORIES = ["Transport", "Repas", "Hôtel"];

interface CategoriesState {
  items: CategoryRow[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  ensureDefaultCategories: () => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  ensureDefaultCategories: async () => {
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
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    // Make sure the three standard categories exist before listing.
    await get().ensureDefaultCategories();

    const { data, error } = await supabase
      .from(TABLES.categories)
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      set({ items: [], loading: false, error: error.message });
      return;
    }
    set({ items: (data as CategoryRow[]) ?? [], loading: false });
  },
}));
