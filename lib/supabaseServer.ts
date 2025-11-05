// lib/supabaseServer.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function supabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
            sameSite: "lax",
            secure: true,
          });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
            sameSite: "lax",
            secure: true,
          });
        },
      },
    }
  );
}

/** Optional: privileged server-only client (for CRON/admin-only routes)
 *  import { createClient } from "@supabase/supabase-js";
 *  export function supabaseService() {
 *    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!, {
 *      auth: { persistSession: false },
 *    });
 *  }
 */
