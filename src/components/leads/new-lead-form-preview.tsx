import type {
  Client,
  EventItem,
  QualificationQuestion
} from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";

type NewLeadFormPreviewProps = {
  clients: Client[];
  events: EventItem[];
  qualificationQuestions: QualificationQuestion[];
};

export function NewLeadFormPreview({
  clients,
  events,
  qualificationQuestions
}: NewLeadFormPreviewProps) {
  return (
    <div className="content-grid">
      <div className="two-column-grid">
        <SurfaceCard title="Lead erfassen" accent>
          <form className="form-grid">
            <label className="field">
              <span>Quelle</span>
              <select defaultValue="Visitenkarte">
                <option>Visitenkarte</option>
                <option>LinkedIn URL</option>
                <option>Manuell</option>
              </select>
            </label>

            <label className="field">
              <span>Client</span>
              <select defaultValue={clients[0]?.name}>
                {clients.map((client) => (
                  <option key={client.id}>{client.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Event</span>
              <select defaultValue={events[0]?.name}>
                {events.map((event) => (
                  <option key={event.id}>{event.name}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Kontaktname</span>
              <input placeholder="z. B. Mara Koenig" />
            </label>

            <label className="field">
              <span>Firma</span>
              <input placeholder="z. B. Syntara Systems" />
            </label>

            <label className="field">
              <span>LinkedIn oder Website</span>
              <input placeholder="https://..." />
            </label>

            <label className="field field-full">
              <span>Gespraechsnotiz</span>
              <textarea
                rows={5}
                placeholder="Was war der Bedarf, welche Rolle hat die Person und was ist der naechste Schritt?"
              />
            </label>
          </form>
        </SurfaceCard>

        <SurfaceCard title="Quali-Logik fuer den MVP">
          <div className="stack-list">
            {qualificationQuestions.map((question) => (
              <article key={question.label} className="list-row">
                <div>
                  <strong>{question.label}</strong>
                  <p>{question.helper}</p>
                </div>
                <span>{question.input}</span>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
