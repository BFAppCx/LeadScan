import "server-only";

import {
  clients as demoClients,
  dashboardStats as demoDashboardStats,
  demoLeadReviewData,
  events as demoEvents,
  leads as demoLeads,
  pipelineSteps,
  qualificationQuestions,
  quickActions,
  type Client,
  type DashboardStat,
  type EventItem,
  type Lead,
  type LeadReviewData,
  type PipelineStep,
  type QualificationQuestion,
  type QuickAction
} from "@/lib/app-data";
import { getBusinessCardBucket, hasSupabaseEnv } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type DashboardData = {
  stats: DashboardStat[];
  pipelineSteps: PipelineStep[];
  quickActions: QuickAction[];
  clients: Client[];
  leads: Lead[];
};

function buildDemoDashboard(): DashboardData {
  return {
    stats: demoDashboardStats,
    pipelineSteps,
    quickActions,
    clients: demoClients,
    leads: demoLeads
  };
}

function buildStats(leads: Lead[]): DashboardStat[] {
  return [
    { label: "Offene Leads", value: String(leads.length) },
    {
      label: "Heisse Leads",
      value: String(leads.filter((lead) => lead.warmth === "heiss").length),
      tone: "success"
    },
    { label: "Aktive Kunden", value: String(new Set(leads.map((lead) => lead.client)).size) },
    { label: "Events im Fokus", value: String(new Set(leads.map((lead) => lead.event)).size) }
  ];
}

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasSupabaseEnv()) {
    return buildDemoDashboard();
  }

  const supabase = await createSupabaseServerClient();
  const [clientsResult, leadsResult] = await Promise.all([
    supabase.from("clients").select("id, name, focus").order("created_at", { ascending: false }),
    supabase
      .from("leads")
      .select(
        `
          id,
          status,
          warmth,
          next_step,
          business_card_assets (id),
          contacts (full_name, company_name, job_title),
          clients (name),
          events (name)
        `
      )
      .order("captured_at", { ascending: false })
  ]);

  if (clientsResult.error || leadsResult.error) {
    return buildDemoDashboard();
  }

  const leads: Lead[] = leadsResult.data.map((lead) => {
    const contact = Array.isArray(lead.contacts) ? lead.contacts[0] : lead.contacts;
    const client = Array.isArray(lead.clients) ? lead.clients[0] : lead.clients;
    const event = Array.isArray(lead.events) ? lead.events[0] : lead.events;
    const hasBusinessCard =
      Array.isArray(lead.business_card_assets) && lead.business_card_assets.length > 0;
    const normalizedStatus = lead.status || "draft";

    return {
      id: lead.id,
      name: contact?.full_name ?? "Unbekannter Kontakt",
      company: contact?.company_name ?? "Unbekannte Firma",
      title: contact?.job_title ?? "Ohne Rolle",
      client: client?.name ?? "Ohne Client",
      event: event?.name ?? "Ohne Event",
      status: normalizedStatus,
      nextStep: lead.next_step ?? "Noch kein naechster Schritt",
      warmth: lead.warmth === "heiss" || lead.warmth === "kalt" ? lead.warmth : "warm",
      hasBusinessCard,
      needsCardReview: hasBusinessCard && normalizedStatus === "OCR offen"
    };
  });

  const leadCountByClient = new Map<string, number>();
  leads.forEach((lead) => {
    leadCountByClient.set(lead.client, (leadCountByClient.get(lead.client) ?? 0) + 1);
  });

  const clients: Client[] = clientsResult.data.map((client) => ({
    id: client.id,
    name: client.name,
    focus: client.focus ?? "Noch kein Fokus hinterlegt",
    activeEvent: "Noch offen",
    openLeads: leadCountByClient.get(client.name) ?? 0,
    template: "Default Template"
  }));

  return {
    stats: buildStats(leads),
    pipelineSteps,
    quickActions,
    clients,
    leads
  };
}

export async function getClientsData() {
  return (await getDashboardData()).clients;
}

export async function getLeadsData() {
  return (await getDashboardData()).leads;
}

export async function getLeadReviewData(leadId: string): Promise<LeadReviewData | null> {
  if (!hasSupabaseEnv()) {
    return demoLeadReviewData.id === leadId ? demoLeadReviewData : null;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      `
        id,
        source_type,
        status,
        warmth,
        next_step,
        raw_notes,
        contacts (id, full_name, company_name, job_title, email, phone, linkedin_url, website),
        clients (name),
        events (name),
        business_card_assets (id, image_path, ocr_provider, ocr_raw_text, ocr_json, created_at),
        qualification_responses (id, answers, priority, created_at)
      `
    )
    .eq("id", leadId)
    .single();

  if (error || !data) {
    return null;
  }

  const contact = Array.isArray(data.contacts) ? data.contacts[0] : data.contacts;
  const client = Array.isArray(data.clients) ? data.clients[0] : data.clients;
  const event = Array.isArray(data.events) ? data.events[0] : data.events;
  const cardAssets = Array.isArray(data.business_card_assets) ? data.business_card_assets : [];
  const latestCardAsset =
    cardAssets.sort((left, right) => right.created_at.localeCompare(left.created_at))[0] ?? null;
  const qualificationResponses = Array.isArray(data.qualification_responses)
    ? data.qualification_responses
    : [];
  const latestQualification =
    qualificationResponses.sort((left, right) =>
      right.created_at.localeCompare(left.created_at)
    )[0] ?? null;

  let businessCardImageUrl: string | null = null;

  if (latestCardAsset?.image_path) {
    const signedUrlResult = await supabase.storage
      .from(getBusinessCardBucket())
      .createSignedUrl(latestCardAsset.image_path, 60 * 60);

    if (!signedUrlResult.error) {
      businessCardImageUrl = signedUrlResult.data.signedUrl;
    }
  }

  const answers =
    latestQualification?.answers && typeof latestQualification.answers === "object"
      ? latestQualification.answers
      : {};
  const ocrJson =
    latestCardAsset?.ocr_json && typeof latestCardAsset.ocr_json === "object"
      ? latestCardAsset.ocr_json
      : {};
  const ocrContact =
    ocrJson.contact && typeof ocrJson.contact === "object" ? ocrJson.contact : {};

  return {
    id: data.id,
    client: client?.name ?? "Ohne Client",
    event: event?.name ?? "Ohne Event",
    sourceType: data.source_type ?? "manual",
    status: data.status ?? "draft",
    warmth: data.warmth === "heiss" || data.warmth === "kalt" ? data.warmth : "warm",
    nextStep: data.next_step ?? "",
    rawNotes: data.raw_notes ?? "",
    fullName: contact?.full_name ?? "",
    companyName: contact?.company_name ?? "",
    jobTitle: contact?.job_title ?? "",
    email: contact?.email ?? "",
    phone: contact?.phone ?? "",
    linkedinUrl: contact?.linkedin_url ?? "",
    website: contact?.website ?? "",
    hasBusinessCard: Boolean(latestCardAsset),
    businessCardImageUrl,
    businessCardImagePath: latestCardAsset?.image_path ?? null,
    ocrRawText: latestCardAsset?.ocr_raw_text ?? "",
    ocrProvider: latestCardAsset?.ocr_provider ?? "",
    ocrSuggestion: {
      fullName: typeof ocrContact.fullName === "string" ? ocrContact.fullName : "",
      companyName: typeof ocrContact.companyName === "string" ? ocrContact.companyName : "",
      jobTitle: typeof ocrContact.jobTitle === "string" ? ocrContact.jobTitle : "",
      email: typeof ocrContact.email === "string" ? ocrContact.email : "",
      phone: typeof ocrContact.phone === "string" ? ocrContact.phone : "",
      linkedinUrl: typeof ocrContact.linkedinUrl === "string" ? ocrContact.linkedinUrl : "",
      website: typeof ocrContact.website === "string" ? ocrContact.website : ""
    },
    qualificationAnswers: {
      need: typeof answers.need === "string" ? answers.need : "",
      roleFit: typeof answers.roleFit === "string" ? answers.roleFit : "",
      timing: typeof answers.timing === "string" ? answers.timing : "",
      priority:
        typeof latestQualification?.priority === "string"
          ? latestQualification.priority
          : typeof answers.priority === "string"
            ? answers.priority
            : ""
    }
  };
}

export async function getEventsData(): Promise<EventItem[]> {
  if (!hasSupabaseEnv()) {
    return demoEvents;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
        id,
        name,
        venue,
        starts_on,
        ends_on,
        event_clients (clients (name)),
        leads (id)
      `
    )
    .order("starts_on", { ascending: false });

  if (error) {
    return demoEvents;
  }

  return data.map((event) => ({
    id: event.id,
    name: event.name,
    venue: event.venue ?? "Unbekannter Ort",
    dates:
      event.starts_on && event.ends_on && event.starts_on !== event.ends_on
        ? `${event.starts_on} - ${event.ends_on}`
        : event.starts_on ?? event.ends_on ?? "Offen",
    clients:
      event.event_clients
        ?.map((item) => {
          const client = Array.isArray(item.clients) ? item.clients[0] : item.clients;
          return client?.name;
        })
        .filter(Boolean) ?? ["Noch kein Client"],
    leadCount: event.leads?.length ?? 0
  }));
}

export async function getQualificationQuestions(): Promise<QualificationQuestion[]> {
  return qualificationQuestions;
}
