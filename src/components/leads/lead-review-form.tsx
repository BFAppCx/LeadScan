"use client";

import Image from "next/image";
import { useActionState } from "react";
import type { LeadReviewData } from "@/lib/app-data";
import {
  runBusinessCardOcrAction,
  updateLeadReviewAction,
  type LeadReviewFormState
} from "@/app/leads/[leadId]/actions";
import { SurfaceCard } from "@/components/ui/surface-card";

type LeadReviewFormProps = {
  lead: LeadReviewData;
};

export function LeadReviewForm({ lead }: LeadReviewFormProps) {
  const initialState: LeadReviewFormState = {};
  const [state, formAction, isPending] = useActionState(updateLeadReviewAction, initialState);
  const [ocrState, ocrAction, isOcrPending] = useActionState(
    runBusinessCardOcrAction,
    initialState
  );
  const mergedFields = {
    fullName: lead.fullName || lead.ocrSuggestion.fullName,
    companyName: lead.companyName || lead.ocrSuggestion.companyName,
    jobTitle: lead.jobTitle || lead.ocrSuggestion.jobTitle,
    email: lead.email || lead.ocrSuggestion.email,
    phone: lead.phone || lead.ocrSuggestion.phone,
    linkedinUrl: lead.linkedinUrl || lead.ocrSuggestion.linkedinUrl,
    website: lead.website || lead.ocrSuggestion.website
  };

  return (
    <div className="content-grid">
      <div className="detail-hero">
        <div>
          <div className="lead-row__header">
            <h2 className="detail-title">{lead.fullName || "Unbekannter Kontakt"}</h2>
            <span className={`warmth-pill warmth-pill-${lead.warmth}`}>{lead.warmth}</span>
            {lead.hasBusinessCard ? <span className="meta-pill">Karte</span> : null}
            {lead.status === "OCR offen" ? (
              <span className="status-pill status-pill-warning">OCR offen</span>
            ) : null}
          </div>
          <p className="detail-subtitle">
            {lead.jobTitle || "Ohne Rolle"} bei {lead.companyName || "Ohne Firma"}
          </p>
        </div>
        <div className="detail-meta-grid">
          <div className="detail-meta-card">
            <span>Client</span>
            <strong>{lead.client}</strong>
          </div>
          <div className="detail-meta-card">
            <span>Event</span>
            <strong>{lead.event}</strong>
          </div>
          <div className="detail-meta-card">
            <span>Quelle</span>
            <strong>{lead.sourceType}</strong>
          </div>
        </div>
      </div>

      <div className="two-column-grid lead-review-grid">
        <SurfaceCard title="Visitenkarte">
          {lead.businessCardImageUrl ? (
            <div className="business-card-preview">
              <div className="business-card-preview__image-wrap">
                <Image
                  src={lead.businessCardImageUrl}
                  alt="Gespeicherte Visitenkarte"
                  fill
                  unoptimized
                  className="business-card-preview__image"
                />
              </div>
              <div className="business-card-preview__meta">
                <strong>Gespeicherte Karte</strong>
                <span>{lead.businessCardImagePath}</span>
              </div>
            </div>
          ) : (
            <div className="empty-panel">
              <strong>Keine Bildvorschau verfuegbar</strong>
              <p>
                Die Karte ist hinterlegt, aber derzeit gibt es noch keine direkte Vorschau oder
                es wurde ohne Bild gearbeitet.
              </p>
            </div>
          )}

          <form action={ocrAction} className="ocr-action-bar">
            <input type="hidden" name="leadId" value={lead.id} />
            <button
              type="submit"
              className="ghost-button"
              disabled={!lead.hasBusinessCard || isOcrPending}
            >
              {isOcrPending ? "OCR laeuft..." : "OCR-Vorschlag erzeugen"}
            </button>
            <span className="field-helper">
              {lead.ocrProvider
                ? `Letzter OCR-Anbieter: ${lead.ocrProvider}`
                : "Noch kein OCR-Lauf vorhanden."}
            </span>
          </form>

          {ocrState.error ? <p className="form-notice form-notice-error">{ocrState.error}</p> : null}
          {ocrState.success ? (
            <p className="form-notice form-notice-success">{ocrState.success}</p>
          ) : null}

          <div className="ocr-panel">
            <span className="table-like__label">OCR Rohtext</span>
            <p>{lead.ocrRawText || "Noch kein OCR-Ergebnis vorhanden."}</p>
          </div>

          {lead.ocrSuggestion.fullName ||
          lead.ocrSuggestion.companyName ||
          lead.ocrSuggestion.email ||
          lead.ocrSuggestion.phone ? (
            <div className="ocr-panel">
              <span className="table-like__label">OCR Feldvorschlaege</span>
              <div className="ocr-suggestion-list">
                {lead.ocrSuggestion.fullName ? (
                  <span>Name: {lead.ocrSuggestion.fullName}</span>
                ) : null}
                {lead.ocrSuggestion.companyName ? (
                  <span>Firma: {lead.ocrSuggestion.companyName}</span>
                ) : null}
                {lead.ocrSuggestion.jobTitle ? (
                  <span>Rolle: {lead.ocrSuggestion.jobTitle}</span>
                ) : null}
                {lead.ocrSuggestion.email ? <span>E-Mail: {lead.ocrSuggestion.email}</span> : null}
                {lead.ocrSuggestion.phone ? <span>Telefon: {lead.ocrSuggestion.phone}</span> : null}
                {lead.ocrSuggestion.website ? <span>Website: {lead.ocrSuggestion.website}</span> : null}
              </div>
            </div>
          ) : null}
        </SurfaceCard>

        <SurfaceCard title="Korrektur und Quali" accent>
          <form action={formAction} className="form-grid">
            <input type="hidden" name="leadId" value={lead.id} />

            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={lead.status}>
                <option value="OCR offen">OCR offen</option>
                <option value="Quali pruefen">Quali pruefen</option>
                <option value="Research offen">Research offen</option>
                <option value="Follow-up planen">Follow-up planen</option>
                <option value="Export bereit">Export bereit</option>
              </select>
            </label>

            <label className="field">
              <span>Lead-Waerme</span>
              <select name="warmth" defaultValue={lead.warmth}>
                <option value="heiss">Heiss</option>
                <option value="warm">Warm</option>
                <option value="kalt">Kalt</option>
              </select>
            </label>

            <label className="field">
              <span>Kontaktname</span>
              <input name="fullName" defaultValue={mergedFields.fullName} />
            </label>

            <label className="field">
              <span>Firma</span>
              <input name="companyName" defaultValue={mergedFields.companyName} />
            </label>

            <label className="field">
              <span>Rolle</span>
              <input name="jobTitle" defaultValue={mergedFields.jobTitle} />
            </label>

            <label className="field">
              <span>E-Mail</span>
              <input name="email" type="email" defaultValue={mergedFields.email} />
            </label>

            <label className="field">
              <span>Telefon</span>
              <input name="phone" defaultValue={mergedFields.phone} />
            </label>

            <label className="field">
              <span>LinkedIn</span>
              <input
                name="linkedinUrl"
                defaultValue={mergedFields.linkedinUrl}
                placeholder="https://..."
              />
            </label>

            <label className="field field-full">
              <span>Website</span>
              <input name="website" defaultValue={mergedFields.website} placeholder="https://..." />
            </label>

            <label className="field">
              <span>Bedarf</span>
              <select name="need" defaultValue={lead.qualificationAnswers.need}>
                <option value="">Waehlen</option>
                <option value="Kein Bedarf">Kein Bedarf</option>
                <option value="Interesse">Interesse</option>
                <option value="Aktiv evaluierend">Aktiv evaluierend</option>
                <option value="Akuter Bedarf">Akuter Bedarf</option>
              </select>
            </label>

            <label className="field">
              <span>Rolle im Buying Process</span>
              <select name="roleFit" defaultValue={lead.qualificationAnswers.roleFit}>
                <option value="">Waehlen</option>
                <option value="Entscheider">Entscheider</option>
                <option value="Einflussnehmer">Einflussnehmer</option>
                <option value="Nutzer">Nutzer</option>
                <option value="Partner">Partner</option>
              </select>
            </label>

            <label className="field">
              <span>Timing</span>
              <select name="timing" defaultValue={lead.qualificationAnswers.timing}>
                <option value="">Waehlen</option>
                <option value="Jetzt">Jetzt</option>
                <option value="3 Monate">3 Monate</option>
                <option value="6 Monate">6 Monate</option>
                <option value="Spaeter">Spaeter</option>
              </select>
            </label>

            <label className="field">
              <span>Prioritaet</span>
              <select name="priority" defaultValue={lead.qualificationAnswers.priority}>
                <option value="">Waehlen</option>
                <option value="hoch">Hoch</option>
                <option value="mittel">Mittel</option>
                <option value="niedrig">Niedrig</option>
              </select>
            </label>

            <label className="field field-full">
              <span>Naechster Schritt</span>
              <input name="nextStep" defaultValue={lead.nextStep} />
            </label>

            <label className="field field-full">
              <span>Notizen</span>
              <textarea name="rawNotes" rows={6} defaultValue={lead.rawNotes} />
            </label>

            {state.error ? <p className="form-notice form-notice-error">{state.error}</p> : null}
            {state.success ? (
              <p className="form-notice form-notice-success">{state.success}</p>
            ) : null}

            <div className="field field-full">
              <button type="submit" className="primary-button" disabled={isPending}>
                {isPending ? "Speichert..." : "Korrekturen speichern"}
              </button>
            </div>
          </form>
        </SurfaceCard>
      </div>
    </div>
  );
}
