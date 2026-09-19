import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

const ROLE_PATHS: Record<string, string[]> = {
  admin: ["/dashboard", "/items", "/inventory", "/minibar", "/linen", "/alerts", "/ia", "/admin/users"],
  gerencia: ["/dashboard", "/items", "/inventory", "/minibar", "/linen", "/alerts", "/ia"],
  gobernanta: ["/dashboard", "/inventory", "/minibar", "/linen", "/alerts", "/ia"],
  piso: ["/dashboard", "/inventory", "/minibar", "/linen"],
  almacen: ["/dashboard", "/items", "/inventory", "/alerts", "/ia"],
  frontdesk: ["/dashboard", "/minibar"],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!user && !isLoginPage && !request.nextUrl.pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && !request.nextUrl.pathname.startsWith("/api")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const role = profile?.role ?? "piso";
    const allowedPaths = ROLE_PATHS[role] ?? ROLE_PATHS.piso;
    const canAccess = allowedPaths.some((path) => request.nextUrl.pathname.startsWith(path));

    if (!canAccess) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
