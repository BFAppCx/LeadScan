"use server";

import { revalidatePath } from "next/cache";
import { extractBusinessCard, getConfiguredOcrProvider } from "@/lib/ocr";
import { getBusinessCardBucket } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureCurrentUserProfile } from "@/server/leadcard-auth";

export type LeadReviewFormState = {
  error?: string;
  success?: string;
};

export async function updateLeadReviewAction(
  _prevState: LeadReviewFormState,
  formData: FormData
): Promise<LeadReviewFormState> {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const jobTitle = String(formData.get("jobTitle") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const nextStep = String(formData.get("nextStep") ?? "").trim();
  const rawNotes = String(formData.get("rawNotes") ?? "").trim();
  const status = String(formData.get("status") ?? "Quali pruefen").trim();
  const warmth = String(formData.get("warmth") ?? "warm").trim();
  const need = String(formData.get("need") ?? "").trim();
  const roleFit = String(formData.get("roleFit") ?? "").trim();
  const timing = String(formData.get("timing") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();

  if (!leadId || !fullName || !companyName) {
    return {
      error: "Bitte Kontaktname, Firma und Lead-ID pruefen."
    };
  }

  const profileResult = await ensureCurrentUserProfile();

  if (!profileResult.ok) {
    return {
      error: profileResult.error
    };
  }

  const supabase = await createSupabaseServerClient();

  const leadUpdate = await supabase
    .from("leads")
    .update({
      status,
      warmth,
      next_step: nextStep || null,
      raw_notes: rawNotes || null
    })
    .eq("id", leadId)
    .eq("owner_user_id", profileResult.user.id);

  if (leadUpdate.error) {
    return {
      error: `Lead konnte nicht aktualisiert werden: ${leadUpdate.error.message}`
    };
  }

  const contactUpdate = await supabase
    .from("contacts")
    .update({
      full_name: fullName,
      company_name: companyName,
      job_title: jobTitle || null,
      email: email || null,
      phone: phone || null,
      linkedin_url: linkedinUrl || null,
      website: website || null
    })
    .eq("lead_id", leadId);

  if (contactUpdate.error) {
    return {
      error: `Kontakt konnte nicht aktualisiert werden: ${contactUpdate.error.message}`
    };
  }

  const qualificationPayload = {
    need,
    roleFit,
    timing,
    priority
  };

  const latestQualificationResult = await supabase
    .from("qualification_responses")
    .select("id")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestQualificationResult.error) {
    return {
      error: `Quali-Antworten konnten nicht geladen werden: ${latestQualificationResult.error.message}`
    };
  }

  const qualificationWrite = latestQualificationResult.data?.id
    ? await supabase
        .from("qualification_responses")
        .update({
          answers: qualificationPayload,
          priority: priority || null,
          next_step: nextStep || null
        })
        .eq("id", latestQualificationResult.data.id)
    : await supabase.from("qualification_responses").insert({
        lead_id: leadId,
        answers: qualificationPayload,
        priority: priority || null,
        next_step: nextStep || null
      });

  if (qualificationWrite.error) {
    return {
      error: `Quali-Antworten konnten nicht gespeichert werden: ${qualificationWrite.error.message}`
    };
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);

  return {
    success: "Lead wurde aktualisiert."
  };
}

export async function runBusinessCardOcrAction(
  _prevState: LeadReviewFormState,
  formData: FormData
): Promise<LeadReviewFormState> {
  const leadId = String(formData.get("leadId") ?? "").trim();

  if (!leadId) {
    return {
      error: "Lead-ID fehlt fuer den OCR-Lauf."
    };
  }

  if (getConfiguredOcrProvider() === "disabled") {
    return {
      error:
        "Noch kein OCR-Provider aktiv. Fuer ein echtes Mehrnutzer-Setup richten wir SELF_HOSTED_OCR_URL fuer einen eigenen OCR-Service ein."
    };
  }

  const profileResult = await ensureCurrentUserProfile();

  if (!profileResult.ok) {
    return {
      error: profileResult.error
    };
  }

  const supabase = await createSupabaseServerClient();
  const cardAssetResult = await supabase
    .from("business_card_assets")
    .select("id, image_path")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (cardAssetResult.error) {
    return {
      error: `Visitenkarte konnte nicht geladen werden: ${cardAssetResult.error.message}`
    };
  }

  if (!cardAssetResult.data?.image_path) {
    return {
      error: "Zu diesem Lead ist noch keine Visitenkarte hinterlegt."
    };
  }

  const downloadResult = await supabase.storage
    .from(getBusinessCardBucket())
    .download(cardAssetResult.data.image_path);

  if (downloadResult.error) {
    return {
      error: `Visitenkartenbild konnte nicht geladen werden: ${downloadResult.error.message}`
    };
  }

  const mimeType = downloadResult.data.type || "image/jpeg";
  const imageBytes = new Uint8Array(await downloadResult.data.arrayBuffer());

  try {
    const { provider, extraction } = await extractBusinessCard(imageBytes, mimeType);

    const updateResult = await supabase
      .from("business_card_assets")
      .update({
        ocr_provider: provider,
        ocr_raw_text: extraction.rawText || null,
        ocr_json: extraction
      })
      .eq("id", cardAssetResult.data.id);

    if (updateResult.error) {
      return {
        error: `OCR-Ergebnis konnte nicht gespeichert werden: ${updateResult.error.message}`
      };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "OCR-Lauf ist fehlgeschlagen."
    };
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);

  return {
    success: "OCR-Vorschlag wurde erzeugt und in die Review-Maske geladen."
  };
}
