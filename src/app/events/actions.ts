"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureCurrentUserProfile } from "@/server/leadcard-auth";

export type EventFormState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<"name", string>>;
};

export async function createEventAction(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const startsOn = String(formData.get("startsOn") ?? "").trim();
  const endsOn = String(formData.get("endsOn") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!name) {
    return {
      error: "Bitte pruefe die markierten Felder.",
      fieldErrors: {
        name: "Bitte einen Event-Namen eintragen."
      }
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      error:
        "Supabase ist noch nicht verbunden. Sobald Login und Supabase aktiv sind, werden Events hier gespeichert."
    };
  }

  const supabase = await createSupabaseServerClient();
  const profileResult = await ensureCurrentUserProfile();

  if (!profileResult.ok) {
    return {
      error: profileResult.error
    };
  }

  const eventInsert = await supabase
    .from("events")
    .insert({
      owner_user_id: profileResult.user.id,
      name,
      venue: venue || null,
      starts_on: startsOn || null,
      ends_on: endsOn || null,
      notes: notes || null
    })
    .select("id")
    .single();

  if (eventInsert.error) {
    return {
      error: `Event konnte nicht gespeichert werden: ${eventInsert.error.message}`
    };
  }

  if (clientId) {
    const { error: joinError } = await supabase.from("event_clients").insert({
      event_id: eventInsert.data.id,
      client_id: clientId
    });

    if (joinError) {
      return {
        error: `Event wurde angelegt, aber die Client-Zuordnung ist fehlgeschlagen: ${joinError.message}`
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/clients");

  return {
    success: `Event "${name}" wurde gespeichert.`
  };
}
