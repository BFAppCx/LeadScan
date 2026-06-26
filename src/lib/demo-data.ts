export type PipelineStep = {
  title: string;
  description: string;
};

export type DashboardStat = {
  label: string;
  value: string;
  tone?: "default" | "success";
};

export type QueueLead = {
  name: string;
  company: string;
  client: string;
  status: string;
};

export const pipelineSteps: PipelineStep[] = [
  {
    title: "Lead anlegen",
    description: "Visitenkarte, Website oder LinkedIn-URL in einem Datensatz erfassen."
  },
  {
    title: "Kunde taggen",
    description: "Jeden Kontakt direkt dem richtigen Auftraggeber zuordnen."
  },
  {
    title: "Gespraech qualifizieren",
    description: "Bedarf, Rolle, Timing und naechsten Schritt in unter 90 Sekunden festhalten."
  },
  {
    title: "KI-Nachbereitung",
    description: "Notizen verdichten, OCR bereinigen und Research spaeter gesammelt ausfuehren."
  },
  {
    title: "CRM-Export",
    description: "Leads pro Kunde in einer sauberen Struktur exportieren oder synchronisieren."
  }
];

export const dashboardStats: DashboardStat[] = [
  { label: "Offene Leads", value: "24" },
  { label: "Heisse Leads", value: "7", tone: "success" },
  { label: "Aktive Kunden", value: "4" }
];

export const queueLeads: QueueLead[] = [
  {
    name: "Mara Koenig",
    company: "Syntara Systems",
    client: "Kunde A",
    status: "Research offen"
  },
  {
    name: "Daniel Vogt",
    company: "Nordlicht Robotics",
    client: "Kunde B",
    status: "Follow-up planen"
  },
  {
    name: "Jana Peters",
    company: "Helion Foods",
    client: "Kunde A",
    status: "Export bereit"
  }
];
