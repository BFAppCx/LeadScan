import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { AppShell } from "@/components/shell/app-shell";
import { requireAuthenticatedUser } from "@/server/leadcard-auth";
import { getDashboardData } from "@/server/leadcard-data";

export default async function Home() {
  await requireAuthenticatedUser();
  const dashboard = await getDashboardData();

  return (
    <AppShell
      eyebrow="Dashboard"
      title="LeadCard sammelt Karten, Quali und Kundenkontext in einem Flow"
      description="Der MVP startet als mobile-first Arbeitsoberflaeche fuer Messen: schnell erfassen, direkt qualifizieren und spaeter sauber ins CRM exportieren."
    >
      {dashboard.warning ? (
        <p className="form-notice form-notice-warning">{dashboard.warning}</p>
      ) : null}
      <DashboardOverview
        stats={dashboard.data.stats}
        pipelineSteps={dashboard.data.pipelineSteps}
        quickActions={dashboard.data.quickActions}
        clients={dashboard.data.clients}
        leads={dashboard.data.leads}
      />
    </AppShell>
  );
}
