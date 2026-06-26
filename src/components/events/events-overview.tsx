import type { EventItem } from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";

type EventsOverviewProps = {
  events: EventItem[];
};

export function EventsOverview({ events }: EventsOverviewProps) {
  return (
    <div className="content-grid">
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
