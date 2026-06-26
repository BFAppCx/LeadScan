import type { Lead } from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";

type LeadsOverviewProps = {
  leads: Lead[];
  created?: boolean;
};

function countByWarmth(leads: Lead[], warmth: Lead["warmth"]) {
  return leads.filter((lead) => lead.warmth === warmth).length;
}

function countByStatus(leads: Lead[], status: string) {
  return leads.filter((lead) => lead.status === status).length;
}

function countByCardReview(leads: Lead[]) {
  return leads.filter((lead) => lead.needsCardReview).length;
}

export function LeadsOverview({ leads, created = false }: LeadsOverviewProps) {
  return (
    <div className="content-grid">
      {created ? (
        <p className="form-notice form-notice-success">
          Lead wurde gespeichert und liegt jetzt in deiner Inbox zur weiteren Bearbeitung.
        </p>
      ) : null}

      <section className="stat-grid">
        <article className="stat-card">
          <span>Alle Leads</span>
          <strong>{leads.length}</strong>
        </article>
        <article className="stat-card stat-card-success">
          <span>Heisse Leads</span>
          <strong>{countByWarmth(leads, "heiss")}</strong>
        </article>
        <article className="stat-card">
          <span>Follow-up planen</span>
          <strong>{countByStatus(leads, "Follow-up planen")}</strong>
        </article>
        <article className="stat-card">
          <span>OCR offen</span>
          <strong>{countByCardReview(leads)}</strong>
        </article>
      </section>

      <SurfaceCard title="Lead Inbox">
        <div className="filter-row">
          <span className="filter-chip">Alle</span>
          <span className="filter-chip filter-chip-active">OCR</span>
          <span className="filter-chip">Warm</span>
          <span className="filter-chip">Kalt</span>
          <span className="filter-chip">Research</span>
          <span className="filter-chip">Export</span>
        </div>

        <div className="table-like">
          {leads.map((lead) => (
            <article key={lead.id} className="table-like__row lead-row">
              <div>
                <div className="lead-row__header">
                  <strong>{lead.name}</strong>
                  <span className={`warmth-pill warmth-pill-${lead.warmth}`}>
                    {lead.warmth}
                  </span>
                  {lead.hasBusinessCard ? <span className="meta-pill">Karte</span> : null}
                  {lead.needsCardReview ? (
                    <span className="status-pill status-pill-warning">OCR offen</span>
                  ) : null}
                </div>
                <p>
                  {lead.title} · {lead.company}
                </p>
              </div>
              <div>
                <span className="table-like__label">Client</span>
                <strong>{lead.client}</strong>
                <p>{lead.event}</p>
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
