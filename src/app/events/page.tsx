import { EventsOverview } from "@/components/events/events-overview";
import { AppShell } from "@/components/shell/app-shell";
import { getEventsData } from "@/server/leadcard-data";

export default async function EventsPage() {
  const events = await getEventsData();

  return (
    <AppShell
      eyebrow="Events"
      title="Messen und Lead-Aufkommen im Blick"
      description="Events buendeln Leads ueber mehrere Clients hinweg und geben dir eine klare Nachbereitungs-Inbox pro Messe."
    >
      <EventsOverview events={events} />
    </AppShell>
  );
}
