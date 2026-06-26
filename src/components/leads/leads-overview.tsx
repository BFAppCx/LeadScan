import type { Lead } from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";

type LeadsOverviewProps = {
  leads: Lead[];
};

export function LeadsOverview({ leads }: LeadsOverviewProps) {
  return (
    <div className="content-grid">
      <SurfaceCard title="Lead Inbox">
        <div className="table-like">
          {leads.map((lead) => (
            <article key={lead.id} className="table-like__row">
              <div>
                <strong>{lead.name}</strong>
                <p>
                  {lead.title} · {lead.company}
                </p>
              </div>
              <div>
                <span className="table-like__label">Client</span>
                <strong>{lead.client}</strong>
              </div>
              <div>
                <span className="table-like__label">Status</span>
                <strong>{lead.status}</strong>
              </div>
              <div>
                <span className="table-like__label">Next step</span>
                <strong>{lead.nextStep}</strong>
              </div>
            </article>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
