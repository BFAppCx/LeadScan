import Link from "next/link";
import type {
  Client,
  DashboardStat,
  Lead,
  PipelineStep,
  QuickAction
} from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";

type DashboardOverviewProps = {
  stats: DashboardStat[];
  pipelineSteps: PipelineStep[];
  quickActions: QuickAction[];
  clients: Client[];
  leads: Lead[];
};

export function DashboardOverview({
  stats,
  pipelineSteps,
  quickActions,
  clients,
  leads
}: DashboardOverviewProps) {
  return (
    <div className="content-grid">
      <section className="stat-grid">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className={stat.tone === "success" ? "stat-card stat-card-success" : "stat-card"}
          >
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <div className="two-column-grid">
        <SurfaceCard title="Quick Actions" accent>
          <div className="stack-list">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href} className="action-row">
                <strong>{action.title}</strong>
                <span>{action.description}</span>
              </Link>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard title="Aktive Clients">
          <div className="stack-list">
            {clients.map((client) => (
              <article key={client.id} className="list-row">
                <div>
                  <strong>{client.name}</strong>
                  <p>{client.focus}</p>
                </div>
                <span>{client.openLeads} Leads</span>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>

      <div className="two-column-grid">
        <SurfaceCard title="Lead Pipeline">
          <ol className="ordered-list">
            {pipelineSteps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </SurfaceCard>

        <SurfaceCard title="Nachbereitungs-Queue">
          <div className="stack-list">
            {leads.slice(0, 3).map((lead) => (
              <article key={lead.id} className="queue-row">
                <div className="queue-row__top">
                  <strong>{lead.name}</strong>
                  <span className={`warmth-pill warmth-pill-${lead.warmth}`}>
                    {lead.warmth}
                  </span>
                </div>
                <p>
                  {lead.company} · {lead.client}
                </p>
                <small>{lead.nextStep}</small>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
