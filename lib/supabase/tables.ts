// Central registry of Supabase table names for Note2Frais (app_b7abd1d2).
// Reference these constants everywhere — never type a raw table-name string.

export const TABLES = {
  users: "app_b7abd1d2_users",
  reviews: "app_b7abd1d2_reviews",
  categories: "app_b7abd1d2_categories",
} as const;

// --- Row types (match the migration columns exactly) -------------------------

export type UserRole = "member" | "admin";

export interface UserRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole | string;
  total_due_eur: number | string | null;
  created_at: string | null;
}

export type ExpenseStatus = "en_attente" | "approuve" | "refuse";

export interface ExpenseRow {
  id: string;
  author_id: string | null;
  user_id: string;
  amount_eur: number | string;
  description: string;
  comment: string | null;
  expense_date: string;
  receipt_url: string | null;
  status: ExpenseStatus | string;
  rating: number | string | null;
  created_at: string | null;
}

export interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string | null;
}
