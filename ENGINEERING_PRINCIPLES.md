# LeadCard Engineering Principles

## Ziel

LeadCard soll so gebaut werden, dass:

- es schnell nutzbar ist
- es spaeter leicht erweitert werden kann
- es keinen Entwickler braucht, der erst Chaos aufraeumen muss

## Grundsaetze

### 1. So wenig Technik wie moeglich

Wir nutzen nur das, was echten Nutzen bringt:

- Next.js
- Supabase
- Vercel
- wenige, etablierte Libraries

Keine unnötigen Framework-Schichten.

### 2. Klare Verantwortungen

Jeder Teil der App soll eine klare Aufgabe haben:

- UI zeigt Daten und sammelt Eingaben
- Server verarbeitet Logik
- Datenbank speichert sauber strukturierte Daten
- KI hilft bei Strukturierung und Zusammenfassung, nicht bei Kernlogik

### 3. Einfache Datenmodelle

Lieber wenige gut benannte Tabellen als abstrakte Universalmodelle.

Tabellen sollen fachlich lesbar sein:

- clients
- events
- leads
- contacts
- qualification_responses

### 4. Keine magische Logik

Keine versteckten Seiteneffekte.

Wenn etwas passiert, soll man es im Code schnell finden:

- wo wird ein Lead angelegt
- wo wird OCR verarbeitet
- wo wird Export erzeugt

### 5. Wenig Custom Infrastructure

Wir bauen keine unnötige Eigenlogik fuer:

- Auth
- Storage
- Deployment
- Datenbankbetrieb

Dafuer nehmen wir Standarddienste.

### 6. Mobile-first, aber web-einfach

Erst eine saubere Web-App.

Keine native App, solange der reale Nutzen nicht klar groesser ist.

### 7. KI nur dort, wo sie wirklich hilft

KI soll:

- OCR-Ergebnisse strukturieren
- Notizen zusammenfassen
- Web-Recherche verdichten

KI soll nicht:

- Business-Logik verstecken
- unkontrolliert Daten veraendern
- CRM-Feldmapping "erraten"

### 8. Lesbarer Code vor cleverem Code

Bevorzugt werden:

- einfache Funktionen
- klare Namen
- wenig Verschachtelung
- kleine Komponenten

Nicht bevorzugt:

- ueberabstrahierte Helfer
- generische Monster-Komponenten
- unnötige Patterns

### 9. Zuerst gute Defaults

Das Produkt soll mit vernuenftigen Standardwerten funktionieren.

Beispiel:

- Standard-Qualifizierungsformular
- Standard-Lead-Status
- Standard-CSV-Export

Konfiguration erst dort, wo sie wirklich gebraucht wird.

### 10. Jede neue Funktion muss Betriebskosten rechtfertigen

Wenn eine Funktion:

- viel Komplexitaet bringt
- selten gebraucht wird
- schlecht testbar ist

dann kommt sie spaeter oder gar nicht.

## Code-Standards

## Dateistruktur

Die Struktur soll flach und auffindbar bleiben.

Beispiel:

- `app/`
- `components/`
- `lib/`
- `server/`
- `types/`

### Komponenten

- klein halten
- fachlich benennen
- keine riesigen UI-Dateien

### Server-Code

- Datenbankzugriffe zentralisieren
- keine SQL-Logik quer durch UI-Dateien verteilen

### Validierung

- Eingaben an klaren Grenzen validieren
- keine stillen Annahmen

## Datenbank-Standards

- sprechende Tabellennamen
- klare Fremdschluessel
- `created_at` und `updated_at` konsequent
- wenig Nullable-Felder, wenn fachlich nicht noetig

## UX-Standards

- Erfassung in unter 90 Sekunden anstreben
- moeglichst wenig Tipparbeit auf dem Handy
- Schaltflaechen statt Textfelder, wo sinnvoll
- spaetere Bearbeitung im Backoffice erlauben

## Was wir bewusst vermeiden

- Microservices
- Event-Driven Overengineering
- komplexe State-Management-Layer ohne Not
- Plugin-Systeme im MVP
- KI-Agenten fuer alles

## Meine Umsetzungsregel

Wenn es zwei Wege gibt, bauen wir den einfacheren, solange er:

- lesbar
- stabil
- erweiterbar

bleibt.
