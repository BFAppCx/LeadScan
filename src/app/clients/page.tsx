import { ClientsOverview } from "@/components/clients/clients-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getClientsData } from "@/server/leadcard-data";

export default async function ClientsPage() {
  const clients = await getClientsData();

  return (
    <AppShell
      eyebrow="Clients"
      title="Auftraggeber mit klaren Templates verwalten"
      description="Jeder Client bekommt seinen eigenen Fokus, sein Qualifizierungs-Template und spaeter sein CRM-Mapping."
    >
      {clients.warning ? (
        <p className="form-notice form-notice-warning">{clients.warning}</p>
      ) : null}
      <ClientsOverview clients={clients.data} />
    </AppShell>
  );
}
