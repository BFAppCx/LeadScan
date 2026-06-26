"use client";

import { useActionState } from "react";
import type { Client } from "@/lib/app-data";
import { createEventAction, type EventFormState } from "@/app/events/actions";
import { SurfaceCard } from "@/components/ui/surface-card";

type NewEventFormProps = {
  clients: Client[];
};

export function NewEventForm({ clients }: NewEventFormProps) {
  const initialState: EventFormState = {};
  const [state, formAction, isPending] = useActionState(createEventAction, initialState);

  return (
    <SurfaceCard title="Neues Event anlegen" accent>
      <form action={formAction} className="form-grid">
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            placeholder="z. B. Hannover Messe"
            className={state.fieldErrors?.name ? "field-control-error" : undefined}
          />
          {state.fieldErrors?.name ? (
            <small className="field-error">{state.fieldErrors.name}</small>
          ) : null}
        </label>

        <label className="field">
          <span>Ort</span>
          <input name="venue" placeholder="z. B. Hannover" />
        </label>

        <label className="field">
          <span>Start</span>
          <input type="date" name="startsOn" />
        </label>

        <label className="field">
          <span>Ende</span>
          <input type="date" name="endsOn" />
        </label>

        <label className="field field-full">
          <span>Erster zugeordneter Client</span>
          <select name="clientId" defaultValue="">
            <option value="">Noch keiner</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field field-full">
          <span>Notizen</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Standort, Messefokus, vorbereitete Fragen oder organisatorische Hinweise"
          />
        </label>

        {state.error ? <p className="form-notice form-notice-error">{state.error}</p> : null}
        {state.success ? <p className="form-notice form-notice-success">{state.success}</p> : null}

        <div className="field field-full">
          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Speichert..." : "Event speichern"}
          </button>
        </div>
      </form>
    </SurfaceCard>
  );
}
