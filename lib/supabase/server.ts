import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Fresh client for server actions. Server actions use the same anon key and
// rely on the caller's session (passed through the auth token) for RLS.
export function getServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
