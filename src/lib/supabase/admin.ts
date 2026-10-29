import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Privileged client using the secret key. BYPASSES RLS.
// Only call this from server code that has already verified the caller is an admin.
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("SUPABASE_SECRET_KEY is not set");
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
