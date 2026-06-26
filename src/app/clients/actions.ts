"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureCurrentUserProfile } from "@/server/leadcard-auth";

export type ClientFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<"name", string>>;
};

export async function createClientAction(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const focus = String(formData.get("focus") ?? "").trim();
  const crmType = String(formData.get("crmType") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    return {
      error: "Bitte pruefe die markierten Felder.",
      fieldErrors: {
        name: "Bitte einen Client-Namen eintragen."
      }
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      error:
        "Supabase ist noch nicht verbunden. Sobald Login und Supabase aktiv sind, werden Clients hier gespeichert."
    };
  }

  const supabase = await createSupabaseServerClient();
  const profileResult = await ensureCurrentUserProfile();

  if (!profileResult.ok) {
    return {
      error: profileResult.error
    };
  }

  const { error } = await supabase.from("clients").insert({
    owner_user_id: profileResult.user.id,
    name,
    focus: focus || null,
    crm_type: crmType || null,
    notes: notes || null
  });

  if (error) {
    return {
      error: `Client konnte nicht gespeichert werden: ${error.message}`
    };
  }

  revalidatePath("/");
  revalidatePath("/clients");

  return {
    success: `Client "${name}" wurde gespeichert.`
  };
}
