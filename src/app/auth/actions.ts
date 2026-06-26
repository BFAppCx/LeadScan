"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
  success?: string;
};

export async function sendMagicLinkAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    return {
      error: "Bitte eine E-Mail-Adresse eingeben."
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      error:
        "Supabase ist noch nicht verbunden. Trage zuerst URL und Anon Key in .env.local ein."
    };
  }

  const supabase = await createSupabaseServerClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/leads/new`
    }
  });

  if (error) {
    return {
      error: `Magic Link konnte nicht gesendet werden: ${error.message}`
    };
  }

  return {
    success:
      "Magic Link gesendet. Oeffne die E-Mail und komme danach automatisch zur App zurueck."
  };
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  redirect("/auth");
}
