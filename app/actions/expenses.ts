"use server";

import { getServerClient } from "@/lib/supabase/server";
import { TABLES, type ExpenseRow, type UserRow } from "@/lib/supabase/tables";
import { expenseInsertSchema, expenseUpdateSchema } from "@/lib/schemas/index";

export type ExpenseResult =
  | { success: true; data: ExpenseRow }
  | { success: false; error: string };

// Look up the acting user's profile to verify role for ownership checks.
async function getUserProfile(userId: string): Promise<UserRow | null> {
  const client = getServerClient();
  const { data } = await client
    .from(TABLES.users)
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as UserRow) ?? null;
}

export async function createExpense(
  input: Record<string, unknown>,
  userId: string,
): Promise<ExpenseResult> {
  const parsed = expenseInsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const client = getServerClient();
  const { data, error } = await client
    .from(TABLES.reviews)
    .insert({
      ...parsed.data,
      user_id: userId,
      author_id: userId,
    })
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ExpenseRow };
}

export async function updateExpense(
  id: string,
  input: Record<string, unknown>,
  userId: string,
): Promise<ExpenseResult> {
  const parsed = expenseUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const client = getServerClient();
  const { data: existing } = await client
    .from(TABLES.reviews)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const row = existing as ExpenseRow | null;
  if (!row) return { success: false, error: "Note de frais introuvable." };

  const profile = await getUserProfile(userId);
  const isManager = profile?.role === "admin";
  const isOwner = row.user_id === userId;
  if (!isManager && !isOwner) {
    return { success: false, error: "Vous n'êtes pas autorisé à modifier cette note." };
  }

  const { data, error } = await client
    .from(TABLES.reviews)
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as ExpenseRow };
}

export async function deleteExpense(
  id: string,
  userId: string,
): Promise<{ success: boolean; error: string | null }> {
  const client = getServerClient();
  const { data: existing } = await client
    .from(TABLES.reviews)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const row = existing as ExpenseRow | null;
  if (!row) return { success: false, error: "Note de frais introuvable." };

  const profile = await getUserProfile(userId);
  const isManager = profile?.role === "admin";
  const isOwner = row.user_id === userId;
  if (!isManager && !isOwner) {
    return { success: false, error: "Vous n'êtes pas autorisé à supprimer cette note." };
  }

  const { error } = await client.from(TABLES.reviews).delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
