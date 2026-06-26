"use client";

import { useActionState } from "react";
import { createClientAction, type ClientFormState } from "@/app/clients/actions";
import { SurfaceCard } from "@/components/ui/surface-card";

export function NewClientForm() {
  const initialState: ClientFormState = {};
  const [state, formAction, isPending] = useActionState(createClientAction, initialState);

  return (
    <SurfaceCard title="Neuen Client anlegen" accent>
      <form action={formAction} className="form-grid">
        <label className="field">
          <span>Name</span>
          <input
            name="name"
            placeholder="z. B. Bag Food"
            className={state.fieldErrors?.name ? "field-control-error" : undefined}
          />
          {state.fieldErrors?.name ? (
            <small className="field-error">{state.fieldErrors.name}</small>
          ) : null}
        </label>

        <label className="field">
          <span>CRM Ziel</span>
          <input name="crmType" placeholder="z. B. HubSpot oder Pipedrive" />
        </label>

        <label className="field field-full">
          <span>Fokus</span>
          <textarea
            name="focus"
            rows={3}
            placeholder="Welche Leads suchst du fuer diesen Client?"
          />
        </label>

        <label className="field field-full">
          <span>Notizen</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Briefing, ICP, Ausschlusskriterien oder Follow-up-Hinweise"
          />
        </label>

        {state.error ? <p className="form-notice form-notice-error">{state.error}</p> : null}
        {state.success ? <p className="form-notice form-notice-success">{state.success}</p> : null}

        <div className="field field-full">
          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Speichert..." : "Client speichern"}
          </button>
        </div>
      </form>
    </SurfaceCard>
  );
}
