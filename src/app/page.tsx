import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getDashboardData } from "@/server/leadcard-data";

export default async function Home() {
  const dashboard = await getDashboardData();

  return (
    <AppShell
      eyebrow="Dashboard"
      title="LeadCard sammelt Karten, Quali und Kundenkontext in einem Flow"
      description="Der MVP startet als mobile-first Arbeitsoberflaeche fuer Messen: schnell erfassen, direkt qualifizieren und spaeter sauber ins CRM exportieren."
    >
      <DashboardOverview
        stats={dashboard.stats}
        pipelineSteps={dashboard.pipelineSteps}
        quickActions={dashboard.quickActions}
        clients={dashboard.clients}
        leads={dashboard.leads}
      />
    </AppShell>
  );
}
