import { EventsOverview } from "@/components/events/events-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getClientsData, getEventsData } from "@/server/leadcard-data";

export default async function EventsPage() {
  const [events, clients] = await Promise.all([getEventsData(), getClientsData()]);

  return (
    <AppShell
      eyebrow="Events"
      title="Messen und Lead-Aufkommen im Blick"
      description="Events buendeln Leads ueber mehrere Clients hinweg und geben dir eine klare Nachbereitungs-Inbox pro Messe."
    >
      <EventsOverview events={events} clients={clients} />
    </AppShell>
  );
}
