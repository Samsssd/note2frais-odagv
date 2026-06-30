"use server";

import { getServerClient } from "@/lib/supabase/server";
import { TABLES, type CategoryRow, type UserRow } from "@/lib/supabase/tables";
import { categoryInsertSchema, categoryUpdateSchema } from "@/lib/schemas/index";

export type CategoryResult =
  | { success: true; data: CategoryRow }
  | { success: false; error: string };

async function getUserProfile(userId: string): Promise<UserRow | null> {
  const client = getServerClient();
  const { data } = await client
    .from(TABLES.users)
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as UserRow) ?? null;
}

// Category mutations are reserved to the manager (admin) role.
async function requireManager(userId: string): Promise<UserRow | null> {
  const profile = await getUserProfile(userId);
  if (profile?.role !== "admin") return null;
  return profile;
}

export async function createCategory(
  input: Record<string, unknown>,
  userId: string,
): Promise<CategoryResult> {
  const profile = await requireManager(userId);
  if (!profile) {
    return { success: false, error: "Réservé aux gestionnaires." };
  }

  const parsed = categoryInsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const client = getServerClient();
  const { data, error } = await client
    .from(TABLES.categories)
    .insert(parsed.data)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as CategoryRow };
}

export async function updateCategory(
  id: string,
  input: Record<string, unknown>,
  userId: string,
): Promise<CategoryResult> {
  const profile = await requireManager(userId);
  if (!profile) {
    return { success: false, error: "Réservé aux gestionnaires." };
  }

  const parsed = categoryUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const client = getServerClient();
  const { data, error } = await client
    .from(TABLES.categories)
    .update(parsed.data)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data: data as CategoryRow };
}

export async function deleteCategory(
  id: string,
  userId: string,
): Promise<{ success: boolean; error: string | null }> {
  const profile = await requireManager(userId);
  if (!profile) {
    return { success: false, error: "Réservé aux gestionnaires." };
  }

  const client = getServerClient();
  const { error } = await client.from(TABLES.categories).delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
