# OCR Plan

## Ziel

Visitenkarten sollen in LeadCard als erster echter Messe-Input erfasst werden.

## Phase 1

### Upload

- Bilddatei waehlen
- Vorschau anzeigen
- Datei einem neuen oder bestehenden Lead zuordnen
- Datei in Supabase Storage ablegen

### Noch nicht in Phase 1

- automatische OCR-Extraktion
- Feld-Mapping aus OCR
- KI-Korrektur

## Phase 2

### OCR-Pipeline

- Upload in Storage
- OCR-Anbieter anbinden
- Rohtext speichern
- Strukturierte Felder vorschlagen
- self-hosted OCR-Worker fuer Mehrnutzerbetrieb vorbereiten

## Phase 3

### Messe-Flow

- Visitenkarte fotografieren
- OCR lesen
- Felder pruefen
- Quali direkt anschliessen

## Branch-Ziel

Der Branch `feature/business-card-ocr` startet mit:

- Visitenkarten-Upload im UI
- sauberer Dateifluss
- vorbereiteter Persistenzstruktur
