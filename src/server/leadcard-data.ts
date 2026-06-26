import "server-only";

import {
  clients as demoClients,
  dashboardStats as demoDashboardStats,
  events as demoEvents,
  leads as demoLeads,
  pipelineSteps,
  qualificationQuestions,
  quickActions,
  type Client,
  type DashboardStat,
  type EventItem,
  type Lead,
  type PipelineStep,
  type QualificationQuestion,
  type QuickAction
} from "@/lib/app-data";
import { hasSupabaseEnv } from "@/lib/supabase/config";
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

    return {
      id: lead.id,
      name: contact?.full_name ?? "Unbekannter Kontakt",
      company: contact?.company_name ?? "Unbekannte Firma",
      title: contact?.job_title ?? "Ohne Rolle",
      client: client?.name ?? "Ohne Client",
      event: event?.name ?? "Ohne Event",
      status: lead.status,
      nextStep: lead.next_step ?? "Noch kein naechster Schritt",
      warmth: lead.warmth === "heiss" || lead.warmth === "kalt" ? lead.warmth : "warm"
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
