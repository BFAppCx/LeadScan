import "server-only";

import { redirect } from "next/navigation";
import { hasSupabaseEnv, isProductionRuntime } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthViewState = {
  hasSupabaseEnv: boolean;
  isSignedIn: boolean;
  email?: string;
  runtime: "production" | "development";
};

export async function getAuthViewState(): Promise<AuthViewState> {
  if (!hasSupabaseEnv()) {
    return {
      hasSupabaseEnv: false,
      isSignedIn: false,
      runtime: isProductionRuntime() ? "production" : "development"
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return {
    hasSupabaseEnv: true,
    isSignedIn: Boolean(user),
    email: user?.email,
    runtime: isProductionRuntime() ? "production" : "development"
  };
}

export async function requireAuthenticatedUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return user;
}

export async function ensureCurrentUserProfile() {
  if (!hasSupabaseEnv()) {
    return {
      ok: false as const,
      error: "Supabase ist noch nicht verbunden."
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false as const,
      error: "Bitte zuerst per Magic Link einloggen."
    };
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata.full_name ?? user.email ?? null
  });

  if (error) {
    return {
      ok: false as const,
      error: `Profil konnte nicht vorbereitet werden: ${error.message}`
    };
  }

  return {
    ok: true as const,
    user
  };
}
