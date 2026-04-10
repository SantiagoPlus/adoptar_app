import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

function isPublicRoute(pathname: string) {
  if (pathname === "/") return true;
  if (pathname.startsWith("/auth")) return true;

  // Pública solo la ficha individual del animal: /animales/[id]
  // Privada la ruta índice /animales
  const animalDetailPattern = /^\/animales\/[^/]+$/;
  if (animalDetailPattern.test(pathname)) return true;

  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  if (!hasEnvVars) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const publicRoute = isPublicRoute(request.nextUrl.pathname);

  if (!user && !publicRoute) {
    const url = request.nextUrl.clone();
    const nextPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    url.pathname = "/auth/login";
    url.searchParams.set("next", nextPath);

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
