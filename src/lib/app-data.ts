export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export type DashboardStat = {
  label: string;
  value: string;
  tone?: "default" | "success";
};

export type PipelineStep = {
  title: string;
  description: string;
};

export type Client = {
  id: string;
  name: string;
  focus: string;
  activeEvent: string;
  openLeads: number;
  template: string;
};

export type EventItem = {
  id: string;
  name: string;
  venue: string;
  dates: string;
  clients: string[];
  leadCount: number;
};

export type Lead = {
  id: string;
  name: string;
  company: string;
  title: string;
  client: string;
  event: string;
  status: string;
  nextStep: string;
  warmth: "heiss" | "warm" | "kalt";
  hasBusinessCard: boolean;
  needsCardReview: boolean;
};

export type LeadReviewData = {
  id: string;
  client: string;
  event: string;
  sourceType: string;
  status: string;
  warmth: "heiss" | "warm" | "kalt";
  nextStep: string;
  rawNotes: string;
  fullName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  website: string;
  hasBusinessCard: boolean;
  businessCardImageUrl: string | null;
  businessCardImagePath: string | null;
  ocrRawText: string;
  qualificationAnswers: {
    need: string;
    roleFit: string;
    timing: string;
    priority: string;
  };
};

export type QuickAction = {
  title: string;
  description: string;
  href: string;
};

export type QualificationQuestion = {
  label: string;
  input: string;
  helper: string;
};

export const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", shortLabel: "Home" },
  { href: "/clients", label: "Clients", shortLabel: "Clients" },
  { href: "/events", label: "Events", shortLabel: "Events" },
  { href: "/leads", label: "Leads", shortLabel: "Leads" },
  { href: "/leads/new", label: "New Lead", shortLabel: "Neu" }
];

export const dashboardStats: DashboardStat[] = [
  { label: "Offene Leads", value: "24" },
  { label: "Heisse Leads", value: "7", tone: "success" },
  { label: "Aktive Kunden", value: "4" },
  { label: "Events im Fokus", value: "2" }
];

export const pipelineSteps: PipelineStep[] = [
  {
    title: "Lead anlegen",
    description: "Visitenkarte, Website oder LinkedIn-URL in einem Datensatz erfassen."
  },
  {
    title: "Client taggen",
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
    description: "Leads pro Client in einer sauberen Struktur exportieren oder synchronisieren."
  }
];

export const quickActions: QuickAction[] = [
  {
    title: "Lead erfassen",
    description: "Startpunkt fuer Karte, LinkedIn-URL oder manuelle Eingabe.",
    href: "/leads/new"
  },
  {
    title: "Clients verwalten",
    description: "Briefings, Templates und CRM-Ziele je Auftraggeber pflegen.",
    href: "/clients"
  },
  {
    title: "Event-Inbox",
    description: "Messe-Leads filtern, nachbearbeiten und exportbereit machen.",
    href: "/leads"
  }
];

export const clients: Client[] = [
  {
    id: "client-a",
    name: "Bag Food",
    focus: "Retail-Tech und Messekontakte fuer Handelsinnovationen",
    activeEvent: "Food Innovation Camp",
    openLeads: 11,
    template: "Retail Discovery"
  },
  {
    id: "client-b",
    name: "GreenMint Systems",
    focus: "B2B SaaS fuer Produktionsbetriebe",
    activeEvent: "Hannover Messe",
    openLeads: 7,
    template: "Operations Fit"
  },
  {
    id: "client-c",
    name: "Nordic Robotics",
    focus: "Automationsloesungen fuer Mid-Market Industrie",
    activeEvent: "Automatica",
    openLeads: 6,
    template: "Automation ROI"
  }
];

export const events: EventItem[] = [
  {
    id: "food-innovation-camp",
    name: "Food Innovation Camp",
    venue: "Hamburg Messe",
    dates: "23.06.2026",
    clients: ["Bag Food"],
    leadCount: 14
  },
  {
    id: "hannover-messe",
    name: "Hannover Messe",
    venue: "Hannover",
    dates: "19.04.2026 - 23.04.2026",
    clients: ["GreenMint Systems", "Nordic Robotics"],
    leadCount: 18
  }
];

export const leads: Lead[] = [
  {
    id: "lead-1",
    name: "Mara Koenig",
    company: "Syntara Systems",
    title: "Head of Partnerships",
    client: "Bag Food",
    event: "Food Innovation Camp",
    status: "Research offen",
    nextStep: "Website pruefen und Intro-Mail vorbereiten",
    warmth: "warm",
    hasBusinessCard: true,
    needsCardReview: false
  },
  {
    id: "lead-2",
    name: "Daniel Vogt",
    company: "Nordlicht Robotics",
    title: "COO",
    client: "GreenMint Systems",
    event: "Hannover Messe",
    status: "Follow-up planen",
    nextStep: "Demo-Interesse mit Kunde abstimmen",
    warmth: "heiss",
    hasBusinessCard: false,
    needsCardReview: false
  },
  {
    id: "lead-3",
    name: "Jana Peters",
    company: "Helion Foods",
    title: "Innovation Manager",
    client: "Bag Food",
    event: "Food Innovation Camp",
    status: "Export bereit",
    nextStep: "Ins CRM uebernehmen",
    warmth: "heiss",
    hasBusinessCard: true,
    needsCardReview: false
  },
  {
    id: "lead-4",
    name: "Kemal Yilmaz",
    company: "ForgeLine",
    title: "Plant Director",
    client: "Nordic Robotics",
    event: "Hannover Messe",
    status: "OCR offen",
    nextStep: "Visitenkarte pruefen und Quali ergaenzen",
    warmth: "kalt",
    hasBusinessCard: true,
    needsCardReview: true
  }
];

export const qualificationQuestions: QualificationQuestion[] = [
  {
    label: "Bedarf",
    input: "Segmented buttons",
    helper: "Kein Bedarf, Interesse, aktiv evaluierend, akuter Bedarf"
  },
  {
    label: "Rolle",
    input: "Single select",
    helper: "Entscheider, Einflussnehmer, Nutzer, Partner"
  },
  {
    label: "Timing",
    input: "Single select",
    helper: "Jetzt, 3 Monate, 6 Monate, spaeter"
  },
  {
    label: "Naechster Schritt",
    input: "Short text",
    helper: "Follow-up, Intro mit Kunde, kein Fit, Research"
  }
];

export const demoLeadReviewData: LeadReviewData = {
  id: "lead-4",
  client: "Nordic Robotics",
  event: "Hannover Messe",
  sourceType: "business_card",
  status: "OCR offen",
  warmth: "kalt",
  nextStep: "Visitenkarte pruefen und Quali ergaenzen",
  rawNotes: "Standgespraech war freundlich. Bedarf noch unscharf, aber Werkleitung will intern pruefen.",
  fullName: "Kemal Yilmaz",
  companyName: "ForgeLine",
  jobTitle: "Plant Director",
  email: "",
  phone: "",
  linkedinUrl: "",
  website: "https://forgeline.example",
  hasBusinessCard: true,
  businessCardImageUrl: null,
  businessCardImagePath: "demo/lead-4/business-card.jpg",
  ocrRawText: "",
  qualificationAnswers: {
    need: "Interesse",
    roleFit: "Einflussnehmer",
    timing: "6 Monate",
    priority: "mittel"
  }
};
