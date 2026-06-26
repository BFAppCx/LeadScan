import { LeadsOverview } from "@/components/leads/leads-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getLeadsData } from "@/server/leadcard-data";

export default async function LeadsPage() {
  const leads = await getLeadsData();

  return (
    <AppShell
      eyebrow="Leads"
      title="Alle Messekontakte in einer Inbox"
      description="Hier landen OCR-Korrekturen, offene Quali, Research und der Weg Richtung CRM-Export."
    >
      <LeadsOverview leads={leads} />
    </AppShell>
  );
}
