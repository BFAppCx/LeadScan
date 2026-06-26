import { LeadsOverview } from "@/components/leads/leads-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getLeadsData } from "@/server/leadcard-data";

type LeadsPageProps = {
  searchParams?: Promise<{
    created?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const leads = await getLeadsData();
  const params = await searchParams;
  const created = params?.created === "1";

  return (
    <AppShell
      eyebrow="Leads"
      title="Alle Messekontakte in einer Inbox"
      description="Hier landen OCR-Korrekturen, offene Quali, Research und der Weg Richtung CRM-Export."
    >
      <LeadsOverview leads={leads} created={created} />
    </AppShell>
  );
}
