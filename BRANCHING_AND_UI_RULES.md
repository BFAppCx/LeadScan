# Branching And UI Rules

## Ziel

LeadCard soll weiterentwickelt werden, ohne:

- funktionierende Staende auf `main` zu gefaehrden
- einzelne Features schwer wartbar zu machen
- das bestehende UI unbeabsichtigt zu zerstoeren

## Branch-Regeln

### 1. `main` ist geschuetzt

Auf `main` kommt nur Code, der:

- fachlich sinnvoll integriert ist
- die Quality Gate Checks besteht
- den betroffenen Flow kurz geprueft hat

Keine Experimente direkt auf `main`.

### 2. Ein Feature = ein Branch

Beispiele:

- `feature/business-card-ocr`
- `feature/lead-detail`
- `feature/csv-export`
- `feature/research-enrichment`

Dadurch bleibt jedes Thema separat bearbeitbar.

### 3. Branches werden nicht weggeworfen

Wichtige Feature-Branches duerfen bestehen bleiben, auch wenn ihr Inhalt nach
`main` uebernommen wurde.

Das hilft bei:

- spaeteren Nachbesserungen
- Feature-Rueckblick
- gezielter Wiederaufnahme eines Themenblocks

### 4. Merge-Regel

Vor einem Merge nach `main` gilt:

- `npm run verify` muss gruen sein
- der Hauptflow des Features wird kurz getestet
- nur dann wird nach `main` uebernommen

## UI-Regeln

### 1. Keine Einmal-Loesungen fuer Standard-UI

Wiederkehrende Muster sollen ueber bestehende Bausteine laufen:

- `AppShell`
- `SurfaceCard`
- Status-/Warmth-Pills
- Standard-Form-Felder
- Standard-Buttons

### 2. Globale Styles nur mit Absicht aendern

`src/app/globals.css` ist ein zentrales UI-Fundament.

Aenderungen dort nur, wenn:

- sie mehreren Screens helfen
- sie keine bestehenden Screens sichtbar verschlechtern
- sie nicht nur ein lokales Einzelproblem loesen

### 3. Neue Feature-UI soll bestehende Sprache sprechen

Neue Seiten oder Module sollen:

- dieselben Abstaende nutzen
- dieselben Radius-/Border-Patterns nutzen
- dieselben Farb- und Statussignale nutzen

### 4. Bestehende Screens nicht unnötig anfassen

Wenn ein neues Feature nur einen Bereich betrifft, werden keine breiten
Layout-Umbauten an anderen Stellen gemacht.

## Revisionssicherheit

### 1. Wichtige Staende duerfen getaggt werden

Wenn ein Stand besonders stabil ist, kann er als Git-Tag markiert werden.

Beispiele:

- `v0.1-core-flow`
- `v0.2-auth-live`
- `v0.3-ocr-start`

### 2. Jede groessere Aenderung bleibt nachvollziehbar

Ziel ist:

- klare Commits
- thematische Branches
- keine unerklaerlichen Misch-Aenderungen

## Arbeitsmodus ab jetzt

LeadCard wird ab hier so weitergebaut:

1. stabiles `main`
2. ein Thema pro Branch
3. Quality Gate vor Commit und Push
4. Merge nach `main` erst nach erfolgreichem Verify und kurzem Flow-Test
5. UI wird inkrementell erweitert, nicht wild umgebaut
