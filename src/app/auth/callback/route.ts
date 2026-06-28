import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseEnv, hasSupabaseEnv } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") ? next : "/";

  if (!hasSupabaseEnv() || !code) {
    return NextResponse.redirect(new URL("/auth", requestUrl.origin));
  }

  const redirectResponse = NextResponse.redirect(new URL(safeNext, requestUrl.origin));
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    return NextResponse.redirect(new URL("/auth", requestUrl.origin));
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          redirectResponse.cookies.set(name, value, options);
        });
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/auth?error=callback", requestUrl.origin));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata.full_name ?? user.email ?? null
    });
  }

  return redirectResponse;
}
