import type { Client } from "@/lib/app-data";
import { NewClientForm } from "@/components/clients/new-client-form";
import { SurfaceCard } from "@/components/ui/surface-card";

type ClientsOverviewProps = {
  clients: Client[];
};

export function ClientsOverview({ clients }: ClientsOverviewProps) {
  return (
    <div className="content-grid">
      <NewClientForm />

      <SurfaceCard title="Aktive Auftraggeber">
        <div className="table-like">
          {clients.map((client) => (
            <article key={client.id} className="table-like__row">
              <div>
                <strong>{client.name}</strong>
                <p>{client.focus}</p>
              </div>
              <div>
                <span className="table-like__label">Aktives Event</span>
                <strong>{client.activeEvent}</strong>
              </div>
              <div>
                <span className="table-like__label">Template</span>
                <strong>{client.template}</strong>
              </div>
              <div>
                <span className="table-like__label">Offene Leads</span>
                <strong>{client.openLeads}</strong>
              </div>
            </article>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
