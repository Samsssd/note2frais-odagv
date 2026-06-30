import { z } from "zod";

// ============================================================================
// Users
// ============================================================================
export const userRoleSchema = z.enum(["member", "admin"]);

export const userInsertSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().trim().min(1).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  role: userRoleSchema.default("member"),
  total_due_eur: z.coerce.number().min(0).default(0),
});

export const userUpdateSchema = z.object({
  full_name: z.string().trim().min(1).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  phone: z.string().trim().optional().nullable(),
  role: userRoleSchema.optional(),
  total_due_eur: z.coerce.number().min(0).optional(),
});

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// ============================================================================
// Expenses (reviews table) — the `description` column stores the category name
// ============================================================================
export const expenseStatusSchema = z.enum([
  "en_attente",
  "approuve",
  "refuse",
]);

export const expenseInsertSchema = z.object({
  amount_eur: z.coerce.number().positive("Le montant doit être positif"),
  description: z
    .string()
    .trim()
    .min(1, "La catégorie est requise"), // stores the expense category
  comment: z.string().trim().optional().nullable(),
  expense_date: z.string().min(1, "La date est requise"), // ISO date yyyy-mm-dd
  receipt_url: z.string().url().optional().nullable(),
  status: expenseStatusSchema.default("en_attente"),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
});

export const expenseUpdateSchema = z.object({
  amount_eur: z.coerce.number().positive().optional(),
  description: z.string().trim().min(1).optional(),
  comment: z.string().trim().optional().nullable(),
  expense_date: z.string().min(1).optional(),
  receipt_url: z.string().url().optional().nullable(),
  status: expenseStatusSchema.optional(),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
});

export type ExpenseInsert = z.infer<typeof expenseInsertSchema>;
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>;

// ============================================================================
// Categories
// ============================================================================
export const categoryInsertSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  description: z.string().trim().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});

export type CategoryInsert = z.infer<typeof categoryInsertSchema>;
export type CategoryUpdate = z.infer<typeof categoryUpdateSchema>;
