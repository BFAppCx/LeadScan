# LeadCard Setup

## Ziel

Das hier ist das einfachste sinnvolle Setup, damit LeadCard sauber entwickelt, gesichert und spaeter deployt werden kann.

## Brauchst du GitHub?

Ja, sehr empfehlenswert.

Nicht zwingend fuer die allererste lokale Dateiablage, aber praktisch notwendig fuer:

- Versionshistorie
- Backup
- spaeteres Deployment
- Zusammenarbeit

Empfehlung:

- GitHub Account
- ein privates Repository fuer `LeadCard`

## Minimal-Setup

### Lokal auf deinem Rechner

Installieren:

- Node.js LTS
- Git for Windows

Derzeit zeigt die offizielle Node.js-Downloadseite `v24.18.0 LTS` als aktuelle LTS-Version.

### Konten / Services

Fuer den MVP reichen:

- GitHub
- Supabase
- Vercel
- OpenAI API

Optional spaeter:

- OCR-Anbieter wie Google Cloud Vision

## Warum genau dieses Setup?

Ich wuerde fuer dich so bauen:

- Next.js fuer die App
- Supabase fuer Datenbank, Auth und Dateispeicher
- Vercel fuer Deployment
- GitHub fuer Code und Deploy-Anbindung

Das ist der kleinste saubere Stack mit wenig Betriebsaufwand.

## Was du jetzt konkret anlegen solltest

### 1. GitHub

- Account erstellen oder vorhandenen nutzen
- neues privates Repository anlegen: `leadcard`

### 2. Node.js

Offizielle Download-Seite:

- [Node.js Download](https://nodejs.org/en/download)

Empfehlung:

- LTS-Version installieren

### 3. Git for Windows

Offizielle Download-Seite:

- [Git for Windows](https://git-scm.com/downloads/win)

### 4. Supabase

- [Supabase Getting Started](https://supabase.com/docs/guides/getting-started)

Anlegen:

- neues Projekt
- Region in Europa waehlen

### 5. Vercel

- [Vercel Docs](https://vercel.com/docs)

Anlegen:

- Account
- spaeter mit GitHub verbinden

### 6. OpenAI API

Anlegen:

- API-Key fuer spaetere KI-Funktionen

Hinweis:

- Den brauchen wir nicht fuer den allerersten UI-Start, aber frueh fuer OCR-Strukturierung, Notiz-Zusammenfassungen und Research-Synthesen.

## Einfachste Reihenfolge

1. Node.js installieren
2. Git installieren
3. GitHub-Account / privates Repo
4. Supabase-Projekt anlegen
5. Vercel-Account anlegen
6. Danach scaffolde ich das Projekt

## Was ich nach dem Setup direkt uebernehmen kann

Sobald `node`, `npm` und `git` verfuegbar sind, mache ich:

1. Next.js-App initialisieren
2. Basisstruktur fuer LeadCard anlegen
3. Supabase anbinden
4. erste Datenbankstruktur vorbereiten
5. erste Screens bauen:
   - Login
   - Kunden
   - Events
   - Neuer Lead

## Nicht noetig fuer den Start

Das brauchst du noch nicht:

- Docker
- native Mobile-App
- Kubernetes
- komplexe CI/CD
- eigenes Backend-Hosting

## Meine Empfehlung

Wenn du es maximal einfach willst:

- Entwicklung lokal
- Code auf GitHub
- Datenbank bei Supabase
- App-Hosting bei Vercel

Damit kann ich schnell bauen, und du hast spaeter wenig Technikpflege.
