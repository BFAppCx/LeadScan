"use client";

import Image from "next/image";
import { useActionState, useMemo, useState } from "react";
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
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState<"business_card" | "linkedin" | "manual">(
    "business_card"
  );

  const previewUrl = useMemo(() => {
    if (!previewFile) {
      return null;
    }

    return URL.createObjectURL(previewFile);
  }, [previewFile]);

  return (
    <div className="content-grid">
      <div className="two-column-grid">
        <SurfaceCard title="Lead erfassen" accent>
          <form action={formAction} className="form-grid">
            <div className="field field-full">
              <span>Quelle</span>
              <div className="source-toggle" role="tablist" aria-label="Lead-Quelle">
                <button
                  type="button"
                  className={
                    sourceType === "business_card"
                      ? "source-toggle__button source-toggle__button-active"
                      : "source-toggle__button"
                  }
                  onClick={() => setSourceType("business_card")}
                >
                  Karte scannen
                </button>
                <button
                  type="button"
                  className={
                    sourceType === "linkedin"
                      ? "source-toggle__button source-toggle__button-active"
                      : "source-toggle__button"
                  }
                  onClick={() => setSourceType("linkedin")}
                >
                  LinkedIn nutzen
                </button>
                <button
                  type="button"
                  className={
                    sourceType === "manual"
                      ? "source-toggle__button source-toggle__button-active"
                      : "source-toggle__button"
                  }
                  onClick={() => setSourceType("manual")}
                >
                  Manuell erfassen
                </button>
              </div>
              <input type="hidden" name="sourceType" value={sourceType} />
            </div>

            <label className="field">
              <span>Lead-Waerme</span>
              <select name="warmth" defaultValue="warm">
                <option value="heiss">Heiss</option>
                <option value="warm">Warm</option>
                <option value="kalt">Kalt</option>
              </select>
            </label>

            {sourceType === "business_card" ? (
              <label className="field field-full">
                <span>Visitenkarte aufnehmen</span>
                <input
                  type="file"
                  name="businessCardImage"
                  accept="image/png,image/jpeg,image/webp"
                  capture="environment"
                  onChange={(event) => {
                    const nextFile = event.currentTarget.files?.[0] ?? null;
                    setPreviewFile(nextFile);
                  }}
                />
                <small className="field-helper">
                  Auf dem Handy oeffnet sich bevorzugt die Rueckkamera. Am Desktop kannst du auch
                  ein Foto oder Screenshot auswaehlen.
                </small>
              </label>
            ) : null}

            {sourceType === "linkedin" ? (
              <div className="field field-full source-hint-card">
                <strong>LinkedIn-Flow</strong>
                <p>
                  Fuege direkt das Profil oder die Firmenwebsite ein. Die eigentliche
                  Hintergrundrecherche haengen wir spaeter an.
                </p>
              </div>
            ) : null}

            {sourceType === "manual" ? (
              <div className="field field-full source-hint-card">
                <strong>Manueller Schnellstart</strong>
                <p>
                  Ideal, wenn du nur kurz ein Gespraech sichern willst und Karte oder Profil erst
                  spaeter nachreichst.
                </p>
              </div>
            ) : null}

            {previewUrl ? (
              <div className="field field-full">
                <div className="upload-preview">
                  <div className="upload-preview__image-wrap">
                    <Image
                      src={previewUrl}
                      alt="Visitenkarten-Vorschau"
                      fill
                      unoptimized
                      className="upload-preview__image"
                    />
                  </div>
                  <div className="upload-preview__meta">
                    <strong>{previewFile?.name}</strong>
                    <span>
                      {previewFile ? `${Math.round(previewFile.size / 1024)} KB` : null}
                    </span>
                  </div>
                  <div className="upload-preview__hint">
                    Bild ist bereit. Nach dem Speichern landet der Lead automatisch in deiner
                    OCR-Inbox.
                  </div>
                </div>
              </div>
            ) : null}

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
              <span>
                {sourceType === "linkedin" ? "LinkedIn URL" : "LinkedIn oder Website"}
              </span>
              <input
                name="websiteOrLinkedin"
                placeholder={
                  sourceType === "linkedin"
                    ? "https://www.linkedin.com/in/..."
                    : "https://..."
                }
              />
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

        <SurfaceCard title="Messemodus">
          <div className="capture-playbook">
            <article className="capture-playbook__step">
              <strong>1. Quelle festlegen</strong>
              <p>Karte, LinkedIn oder nur die Notiz. So bleibt jeder Lead sofort gesichert.</p>
            </article>
            <article className="capture-playbook__step">
              <strong>2. Kunde taggen</strong>
              <p>Direkt dem passenden Auftraggeber zuordnen, damit spaeter kein Sortierchaos entsteht.</p>
            </article>
            <article className="capture-playbook__step">
              <strong>3. Naechsten Schritt sichern</strong>
              <p>Ein klarer Follow-up-Satz ist auf Messen oft wichtiger als perfekte Vollstaendigkeit.</p>
            </article>
          </div>

          <div className="stack-list">
            {qualificationQuestions.map((question) => (
              <article key={question.label} className="list-row">
                <div>
                  <strong>{question.label}</strong>
                  <p>{question.helper}</p>
                </div>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
