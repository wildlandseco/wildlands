import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  // Only guard the /portal section
  if (!pathname.startsWith("/portal")) {
    return NextResponse.next();
  }

  // Allow auth routes to pass without redirect to avoid loops
  const isAuthRoute =
    pathname === "/portal/login" ||
    pathname.startsWith("/portal/auth"); // adjust if you have other auth paths

  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Prepare a mutable response so Supabase can set cookies
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/portal/login", origin);
    // Preserve where the user tried to go (path + search)
    loginUrl.searchParams.set("redirect", pathname + (search || ""));
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated, proceed
  return res;
}

// Keep the matcher scoped to /portal only
export const config = {
  matcher: ["/portal/:path*"],
};
