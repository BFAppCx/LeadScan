"use client";

import { useActionState } from "react";
import type {
  Client,
  EventItem,
  QualificationQuestion
} from "@/lib/app-data";
import { SurfaceCard } from "@/components/ui/surface-card";
import { createLeadAction, type NewLeadFormState } from "@/app/leads/new/actions";

type NewLeadFormProps = {
  clients: Client[];
  events: EventItem[];
  qualificationQuestions: QualificationQuestion[];
};

export function NewLeadForm({
  clients,
  events,
  qualificationQuestions
}: NewLeadFormProps) {
  const initialState: NewLeadFormState = {};
  const [state, formAction, isPending] = useActionState(createLeadAction, initialState);

  return (
    <div className="content-grid">
      <div className="two-column-grid">
        <SurfaceCard title="Lead erfassen" accent>
          <form action={formAction} className="form-grid">
            <label className="field">
              <span>Quelle</span>
              <select name="sourceType" defaultValue="business_card">
                <option value="business_card">Visitenkarte</option>
                <option value="linkedin">LinkedIn URL</option>
                <option value="manual">Manuell</option>
              </select>
            </label>

            <label className="field">
              <span>Lead-Waerme</span>
              <select name="warmth" defaultValue="warm">
                <option value="heiss">Heiss</option>
                <option value="warm">Warm</option>
                <option value="kalt">Kalt</option>
              </select>
            </label>

            <label className="field">
              <span>Client</span>
              <select
                name="clientId"
                defaultValue={clients[0]?.id ?? ""}
                className={state.fieldErrors?.clientId ? "field-control-error" : undefined}
              >
                <option value="" disabled>
                  Client waehlen
                </option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.clientId ? (
                <small className="field-error">{state.fieldErrors.clientId}</small>
              ) : null}
            </label>

            <label className="field">
              <span>Event</span>
              <select name="eventId" defaultValue={events[0]?.id ?? ""}>
                <option value="">Kein Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Kontaktname</span>
              <input
                name="fullName"
                placeholder="z. B. Mara Koenig"
                className={state.fieldErrors?.fullName ? "field-control-error" : undefined}
              />
              {state.fieldErrors?.fullName ? (
                <small className="field-error">{state.fieldErrors.fullName}</small>
              ) : null}
            </label>

            <label className="field">
              <span>Firma</span>
              <input
                name="companyName"
                placeholder="z. B. Syntara Systems"
                className={state.fieldErrors?.companyName ? "field-control-error" : undefined}
              />
              {state.fieldErrors?.companyName ? (
                <small className="field-error">{state.fieldErrors.companyName}</small>
              ) : null}
            </label>

            <label className="field">
              <span>Rolle</span>
              <input name="jobTitle" placeholder="z. B. Head of Partnerships" />
            </label>

            <label className="field">
              <span>LinkedIn oder Website</span>
              <input name="websiteOrLinkedin" placeholder="https://..." />
            </label>

            <label className="field field-full">
              <span>Naechster Schritt</span>
              <input
                name="nextStep"
                placeholder="z. B. Intro-Mail senden oder Demo mit Kunde abstimmen"
              />
            </label>

            <label className="field field-full">
              <span>Gespraechsnotiz</span>
              <textarea
                name="rawNotes"
                rows={5}
                placeholder="Was war der Bedarf, welche Rolle hat die Person und was ist der naechste Schritt?"
              />
            </label>

            {state.error ? <p className="form-notice form-notice-error">{state.error}</p> : null}

            <div className="field field-full">
              <button type="submit" className="primary-button" disabled={isPending}>
                {isPending ? "Speichert..." : "Lead speichern"}
              </button>
            </div>
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
