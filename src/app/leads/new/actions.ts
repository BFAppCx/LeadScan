"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBusinessCardBucket, hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureCurrentUserProfile } from "@/server/leadcard-auth";

export type NewLeadFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"clientId" | "fullName" | "companyName", string>>;
};

export async function createLeadAction(
  _prevState: NewLeadFormState,
  formData: FormData
): Promise<NewLeadFormState> {
  const sourceType = String(formData.get("sourceType") ?? "business_card");
  const clientId = String(formData.get("clientId") ?? "").trim();
  const eventId = String(formData.get("eventId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const websiteOrLinkedin = String(formData.get("websiteOrLinkedin") ?? "").trim();
  const nextStep = String(formData.get("nextStep") ?? "").trim();
  const rawNotes = String(formData.get("rawNotes") ?? "").trim();
  const warmth = String(formData.get("warmth") ?? "warm").trim();
  const businessCardImage = formData.get("businessCardImage");
  const hasBusinessCardUpload = businessCardImage instanceof File && businessCardImage.size > 0;

  const fieldErrors: NewLeadFormState["fieldErrors"] = {};

  if (!clientId) {
    fieldErrors.clientId = "Bitte einen Client auswaehlen.";
  }

  if (!fullName) {
    fieldErrors.fullName = "Bitte einen Kontaktnamen eintragen.";
  }

  if (!companyName) {
    fieldErrors.companyName = "Bitte eine Firma eintragen.";
  }

  if (fieldErrors.clientId || fieldErrors.fullName || fieldErrors.companyName) {
    return {
      error: "Bitte pruefe die markierten Felder.",
      fieldErrors
    };
  }

  if (!hasSupabaseEnv()) {
    return {
      error:
        "Die App ist bereit zum Speichern, aber Supabase ist noch nicht verbunden. Trage zuerst URL und Anon Key in .env.local ein."
    };
  }

  const supabase = await createSupabaseServerClient();
  const profileResult = await ensureCurrentUserProfile();

  if (!profileResult.ok) {
    return {
      error: profileResult.error
    };
  }

  const leadInsert = await supabase
    .from("leads")
    .insert({
      owner_user_id: profileResult.user.id,
      client_id: clientId,
      event_id: eventId || null,
      source_type: sourceType,
      status: hasBusinessCardUpload ? "OCR offen" : "draft",
      warmth,
      next_step:
        nextStep ||
        (hasBusinessCardUpload ? "Visitenkarte pruefen und Quali ergaenzen" : null),
      raw_notes: rawNotes || null
    })
    .select("id")
    .single();

  if (leadInsert.error) {
    return {
      error: `Lead konnte nicht gespeichert werden: ${leadInsert.error.message}`
    };
  }

  const contactInsert = await supabase.from("contacts").insert({
    lead_id: leadInsert.data.id,
    full_name: fullName,
    job_title: jobTitle || null,
    company_name: companyName,
    linkedin_url:
      websiteOrLinkedin.startsWith("https://www.linkedin.com") ||
      websiteOrLinkedin.startsWith("http://www.linkedin.com")
        ? websiteOrLinkedin
        : null,
    website:
      websiteOrLinkedin && !websiteOrLinkedin.includes("linkedin.com")
        ? websiteOrLinkedin
        : null
  });

  if (contactInsert.error) {
    await supabase.from("leads").delete().eq("id", leadInsert.data.id);
    return {
      error: `Kontakt konnte nicht gespeichert werden: ${contactInsert.error.message}`
    };
  }

  if (hasBusinessCardUpload) {
    const bucket = getBusinessCardBucket();
    const extension = businessCardImage.name.includes(".")
      ? businessCardImage.name.split(".").pop()?.toLowerCase()
      : "jpg";
    const safeExtension = extension && extension.length <= 5 ? extension : "jpg";
    const filePath =
      `${profileResult.user.id}/${leadInsert.data.id}/business-card-${Date.now()}.${safeExtension}`;

    const uploadResult = await supabase.storage.from(bucket).upload(
      filePath,
      new Uint8Array(await businessCardImage.arrayBuffer()),
      {
        contentType: businessCardImage.type || "image/jpeg",
        upsert: false
      }
    );

    if (uploadResult.error) {
      await supabase.from("leads").delete().eq("id", leadInsert.data.id);
      return {
        error:
          uploadResult.error.message.includes("Bucket not found")
            ? `Visitenkarte konnte nicht gespeichert werden, weil der Storage-Bucket "${bucket}" noch fehlt. Bitte lege ihn in Supabase Storage an.`
            : `Visitenkarte konnte nicht gespeichert werden: ${uploadResult.error.message}`
      };
    }

    const assetInsert = await supabase.from("business_card_assets").insert({
      lead_id: leadInsert.data.id,
      image_path: filePath,
      ocr_provider: null,
      ocr_raw_text: null,
      ocr_json: null
    });

    if (assetInsert.error) {
      await supabase.storage.from(bucket).remove([filePath]);
      await supabase.from("leads").delete().eq("id", leadInsert.data.id);
      return {
        error: `Visitenkarten-Metadaten konnten nicht gespeichert werden: ${assetInsert.error.message}`
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/clients");
  revalidatePath("/events");
  revalidatePath("/leads");
  redirect("/leads?created=1");
}
