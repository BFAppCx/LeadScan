# LeadCard MVP Spec

## Ziel

LeadCard ist eine mobile-first Messe-Lead-Erfassungs-App fuer Agenturen und externe Vertriebsteams, die im Namen mehrerer Kunden arbeiten.

Der Kernnutzen:

- Kontakte schnell auf einer Messe erfassen
- Jeden Lead direkt einem Kunden zuordnen
- Direkt nach dem Gespraech strukturiert qualifizieren
- Briefing, Notizen und Kontaktdaten in einem Datensatz halten
- Leads spaeter gesammelt mit KI anreichern
- Daten sauber ins CRM exportieren

## Kernproblem

Der heutige Prozess ist fragmentiert:

- Visitenkarte liegt physisch vor
- Notizen landen unstrukturiert in einer Notiz-App
- Kundenkontext ist getrennt vom Kontakt
- Qualifizierung ist nicht standardisiert
- CRM-Einpflege passiert spaeter manuell

Das fuehrt zu:

- Informationsverlust
- uneinheitlicher Qualitaet
- langsamer Nachbereitung
- hohem Admin-Aufwand

## Zielgruppe

Primare Nutzer:

- Lead-Gen-Agenturen
- externe Vertriebsteams
- Handelsvertreter
- Messeakquise-Dienstleister

Sekundaere Nutzer:

- kleine Sales-Teams mit mehreren Produkten oder Marken
- Berater mit Event- und Networking-Fokus

## Produktpositionierung

LeadCard ist kein allgemeines CRM.

LeadCard ist die Erfassungs- und Qualifizierungs-Schicht zwischen Messegespraech und CRM.

Positionierung:

- besser strukturiert als Notizen
- flexibler als reine Visitenkartenscanner
- fokussierter als ein vollwertiges CRM

## MVP-Workflow

### 1. Messe vorbereiten

Vor der Messe legt der Nutzer an:

- Event / Messe
- aktive Kunden / Auftraggeber
- optional pro Kunde ein Qualifizierungsformular
- optional Tags, Zielbranchen und ICP-Hinweise

### 2. Lead erfassen

Ein neuer Lead kann erzeugt werden durch:

- Foto einer Visitenkarte
- manuelle Eingabe
- LinkedIn-URL oder Firmen-Website
- spaeter optional Badge-Scan / QR-Scan

Zu jedem Lead werden sofort mitgespeichert:

- Messe
- verantwortlicher Kunde
- Quelle des Leads
- Zeitpunkt der Erfassung

### 3. Direkt nach Gespraech qualifizieren

Der Nutzer fuellt direkt nach dem Gespraech ein kompaktes Formular aus:

- Relevanz / Lead Score grob
- Bedarf
- Entscheidungsrolle
- Zeitrahmen
- Budgetsignal
- Folgeaktion
- Freitextnotiz
- Sprachnotiz optional

### 4. Nachbereitung

Nach der Messe sieht der Nutzer alle offenen Leads in einer Inbox.

Dort kann er:

- OCR-Daten korrigieren
- Leads zusammenfuehren
- KI-Zusammenfassungen erzeugen
- Firmen- und Web-Recherche anstossen
- CRM-Export vorbereiten

### 5. Export / Sync

Im MVP zuerst:

- CSV/XLSX Export
- kundenspezifisches Feldmapping

Danach:

- HubSpot Sync
- Pipedrive Sync
- Salesforce Sync

## MVP-Funktionen

### Muss im MVP enthalten sein

- Login
- Nutzerkonto
- Kundenverwaltung
- Event/Messe-Verwaltung
- Lead-Erfassung
- Upload von Visitenkartenfoto
- OCR-Extraktion
- manuelle Korrektur der Felder
- Qualifizierungsformular je Lead
- Notiz- und Sprachnotiz-Feld
- Lead-Liste mit Filtern
- Lead-Detailansicht
- Status und Follow-up-Felder
- CSV-Export
- einfache KI-Zusammenfassung

### Soll im MVP moeglich sein

- unterschiedliche Qualifizierungsformulare pro Kunde
- Dublettenpruefung
- Recherche-Status
- Batch-Enrichment fuer mehrere Leads
- CRM-Exportprofile pro Kunde

### Nicht im MVP

- vollwertiges CRM
- Outreach / E-Mail-Automation
- automatische LinkedIn-Scraping-Engine
- komplexe Teamrechte
- native Mobile-App

## Datenmodell

### User

- id
- name
- email
- role
- created_at

### Client

- id
- name
- industry
- notes
- crm_type
- crm_export_profile_id
- created_at

### Event

- id
- name
- location
- start_date
- end_date
- notes
- created_by

### QualificationTemplate

- id
- client_id
- name
- version
- fields_json
- is_default

### Lead

- id
- client_id
- event_id
- owner_user_id
- source_type
- status
- captured_at
- consent_status
- follow_up_due_at
- raw_notes
- voice_note_path
- ai_summary
- research_status
- crm_export_status
- created_at
- updated_at

### Contact

- id
- lead_id
- first_name
- last_name
- full_name
- job_title
- email
- phone
- linkedin_url
- company_name
- website
- city
- country

### BusinessCardAsset

- id
- lead_id
- image_path
- ocr_provider
- ocr_raw_text
- ocr_json
- confidence_score
- created_at

### QualificationResponse

- id
- lead_id
- template_id
- answers_json
- quick_score
- next_step
- priority
- created_at

### ResearchSnapshot

- id
- lead_id
- provider
- input_json
- output_json
- summary
- created_at

### ExportJob

- id
- client_id
- event_id
- format
- mapping_json
- file_path
- status
- created_at

## Beispiel fuer Qualification-Felder

Minimaler Standard:

- Produktinteresse
- Bedarfsgrad
- Rolle im Kaufprozess
- Zeithorizont
- Budgetsignal
- Naechster Schritt
- Notiz

Schnell bedienbar per Buttons:

- heiss
- warm
- kalt
- unklar

## KI-Umfang im MVP

KI soll im MVP helfen, nicht den Prozess dominieren.

Sinnvolle Aufgaben:

- OCR-Rohtext in strukturierte Kontaktfelder umwandeln
- Freitextnotiz in klares Briefing umformulieren
- aus Notiz + Website eine kompakte Lead-Zusammenfassung erzeugen
- Lead fuer CRM-Import textlich standardisieren

Wichtige Grenze:

- kein automatisiertes LinkedIn-Scraping als Kernfunktion
- Research bevorzugt ueber Firmenwebsite und oeffentlich verfuegbare Webquellen
- LinkedIn-URL eher als manuell hinzugefuegtes Referenzfeld

## Technische Architektur fuer MVP

Empfohlener Stack:

- Frontend: Next.js
- UI: mobile-first Web-App
- Backend: Next.js Server Actions oder API Routes
- Datenbank: Postgres via Supabase
- Storage: Supabase Storage
- Auth: Supabase Auth
- OCR: Google Cloud Vision oder vergleichbarer OCR-Dienst
- KI: OpenAI fuer Strukturierung, Zusammenfassung und Research-Synthese
- Export: CSV/XLSX Generator

## Wichtige Produktentscheidungen

### 1. Mobile-first statt native App

Fuer den Start reicht eine gute Web-App, solange sie auf dem Handy schnell und robust laeuft.

### 2. Offline-Light statt Voll-Offline im MVP

Im MVP:

- Formulare schnell und leicht
- lokale Drafts spaeter moeglich

Nicht sofort:

- kompletter Offline-Sync mit Konfliktaufloesung

### 3. Research nachgelagert

Research sollte nicht waehrend des Messegespraechs passieren, sondern gesammelt nach der Messe.

### 4. Kundenspezifische Felder sind Pflicht

Das ist einer der staerksten Unterschiede gegenueber Standard-Lead-Capture-Apps.

## Risiken

### Produkt-Risiken

- zu breit werden und CRM nachbauen
- zu viel KI zu frueh einbauen
- zu komplexe Formulare, die auf der Messe niemand ausfuellt

### Technische Risiken

- OCR-Qualitaet bei schlechten Fotos
- Dubletten-Logik bei mehreren Quellen
- uneinheitliche CRM-Felder je Kunde

### Rechtliche / Plattform-Risiken

- LinkedIn-Automation und Scraping vermeiden
- DSGVO-konforme Datenspeicherung und Exportprozesse beachten
- klare Dokumentation fuer Datenquelle und Follow-up-Rechtsgrundlage

## Erfolgskriterien fuer MVP

Der MVP ist erfolgreich, wenn:

- ein Lead in unter 90 Sekunden erfasst und qualifiziert werden kann
- ein Lead ohne Notiz-Chaos spaeter vollstaendig verstanden wird
- ein kompletter Messe-Datensatz gesammelt exportierbar ist
- pro Kunde unterschiedliche Briefing-Logik abbildbar ist
- die Nachbereitung deutlich schneller ist als heute

## Roadmap nach MVP

### Phase 2

- HubSpot-Integration
- Pipedrive-Integration
- besseres Dubletten-Handling
- Batch-AI fuer ganze Events
- Audio-Transkription

### Phase 3

- Teamfunktionen
- Rechte und Rollen
- native mobile App
- Badge-/QR-Scan
- Reporting pro Messe und Kunde

## Erste Build-Reihenfolge

1. Datenmodell und Auth
2. Kunden- und Event-Verwaltung
3. Lead-Erfassungsformular
4. Visitenkarten-Upload
5. OCR + manuelle Korrektur
6. Qualifizierungsformular
7. Lead-Liste und Detailseite
8. CSV-Export
9. KI-Zusammenfassung

## Nächster sinnvoller Schritt

Aus dieser Spezifikation sollten als Naechstes entstehen:

- User Flow
- Wireframes fuer Mobile
- Datenbankschema
- erste App-Grundstruktur
