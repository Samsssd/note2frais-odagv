"use server";

import { getServerClient } from "@/lib/supabase/server";
import { TABLES, type UserRow } from "@/lib/supabase/tables";
import { userUpdateSchema } from "@/lib/schemas/index";

async function getUserProfile(userId: string): Promise<UserRow | null> {
  const client = getServerClient();
  const { data } = await client
    .from(TABLES.users)
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as UserRow) ?? null;
}

export type UsersReport = {
  success: true;
  consultants: UserRow[];
  managers: UserRow[];
  all: UserRow[];
};
export type UsersReportError = { success: false; error: string };

/** Return all consultants and managers for the monthly report (managers only). */
export async function fetchUsersForReport(
  userId: string,
): Promise<UsersReport | UsersReportError> {
  const profile = await getUserProfile(userId);
  if (profile?.role !== "admin") {
    return { success: false, error: "Réservé aux gestionnaires." };
  }

  const client = getServerClient();
  const { data, error } = await client
    .from(TABLES.users)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  const all = (data as UserRow[]) ?? [];
  return {
    success: true,
    all,
    consultants: all.filter((u) => u.role !== "admin"),
    managers: all.filter((u) => u.role === "admin"),
  };
}

/** Update a user's role (manager only). */
export async function updateUserRole(
  targetUserId: string,
  role: string,
  actingUserId: string,
): Promise<{ success: boolean; error: string | null }> {
  const profile = await getUserProfile(actingUserId);
  if (profile?.role !== "admin") {
    return { success: false, error: "Réservé aux gestionnaires." };
  }

  const parsed = userUpdateSchema.safeParse({ role });
  if (!parsed.success || !parsed.data.role) {
    return {
      success: false,
      error: parsed.error
        ? parsed.error.issues.map((i) => i.message).join(", ")
        : "Rôle invalide.",
    };
  }

  const client = getServerClient();
  const { error } = await client
    .from(TABLES.users)
    .update({ role: parsed.data.role })
    .eq("id", targetUserId);

  if (error) return { success: false, error: error.message };
  return { success: true, error: null };
}
