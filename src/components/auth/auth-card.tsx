"use client";

import { useActionState } from "react";
import { sendMagicLinkAction, type AuthFormState } from "@/app/auth/actions";

type AuthCardProps = {
  callbackError?: boolean;
};

export function AuthCard({ callbackError = false }: AuthCardProps) {
  const initialState: AuthFormState = callbackError
    ? {
        error:
          "Der Ruecksprung aus der Magic-Link-Anmeldung hat nicht geklappt. Bitte versuche es noch einmal."
      }
    : {};

  const [state, formAction, isPending] = useActionState(sendMagicLinkAction, initialState);

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="eyebrow">Supabase Auth</div>
        <h1 className="auth-card__title">LeadCard Login per Magic Link</h1>
        <p className="auth-card__copy">
          Fuer den Start halten wir es einfach: E-Mail eingeben, Link oeffnen,
          zur App zurueckkehren.
        </p>

        <form action={formAction} className="auth-form">
          <label className="field">
            <span>E-Mail</span>
            <input
              type="email"
              name="email"
              placeholder="du@beispiel.de"
              autoComplete="email"
              required
            />
          </label>

          {state.error ? <p className="form-notice form-notice-error">{state.error}</p> : null}
          {state.success ? (
            <p className="form-notice form-notice-success">{state.success}</p>
          ) : null}

          <button type="submit" className="primary-button" disabled={isPending}>
            {isPending ? "Sendet..." : "Magic Link senden"}
          </button>
        </form>
      </section>
    </main>
  );
}
