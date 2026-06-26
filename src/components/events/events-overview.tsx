import type { Client, EventItem } from "@/lib/app-data";
import { NewEventForm } from "@/components/events/new-event-form";
import { SurfaceCard } from "@/components/ui/surface-card";

type EventsOverviewProps = {
  events: EventItem[];
  clients: Client[];
};

export function EventsOverview({ events, clients }: EventsOverviewProps) {
  return (
    <div className="content-grid">
      <NewEventForm clients={clients} />

      <SurfaceCard title="Events mit Lead-Aufkommen">
        <div className="stack-list">
          {events.map((event) => (
            <article key={event.id} className="event-card">
              <div>
                <strong>{event.name}</strong>
                <p>
                  {event.venue} · {event.dates}
                </p>
              </div>
              <div className="event-card__meta">
                <span>{event.clients.join(", ")}</span>
                <strong>{event.leadCount} Leads</strong>
              </div>
            </article>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
