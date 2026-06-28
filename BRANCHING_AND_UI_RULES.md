# Branching And UI Rules

## Ziel

LeadCard soll weiterentwickelt werden, ohne:

- funktionierende Staende auf `main` zu gefaehrden
- einzelne Features schwer wartbar zu machen
- das bestehende UI unbeabsichtigt zu zerstoeren

## Branch-Regeln

### 1. Branch-Rollen sind jetzt klar getrennt

- `feature/*` = aktive Entwicklung einzelner Themen
- `live` = gepruefter Stand, der auf Hostinger ausgerollt wird
- `main` = stabile interne Hauptlinie und Sicherheitsanker

### 2. `feature/*` ist reine Bauzone

Auf Feature-Branches darf:

- entwickelt
- ausprobiert
- umgebaut
- feinjustiert

werden, solange das Thema klar abgegrenzt bleibt.

### 3. `live` ist der Deploy-Branch

Auf `live` kommt nur Code, der:

- fachlich sinnvoll integriert ist
- `npm run verify` besteht
- im betroffenen Flow kurz geprueft wurde
- fuer Hostinger freigegeben ist

Hostinger soll kuenftig immer `live` deployen, nicht einzelne Feature-Branches.

### 4. `main` bleibt geschuetzt

`main` bleibt die stabile Produktlinie im Repo.

Damit haben wir:

- einen klaren Live-Zweig fuer Deployment
- eine saubere Hauptlinie als Rueckfallanker
- getrennte Feature-Arbeit ohne Chaos

Keine Experimente direkt auf `main` oder `live`.

### 5. Ein Feature = ein Branch

Beispiele:

- `feature/business-card-ocr`
- `feature/lead-detail`
- `feature/csv-export`
- `feature/research-enrichment`

Dadurch bleibt jedes Thema separat bearbeitbar.

### 6. Branches werden nicht weggeworfen

Wichtige Feature-Branches duerfen bestehen bleiben, auch wenn ihr Inhalt nach
`live` oder `main` uebernommen wurde.

Das hilft bei:

- spaeteren Nachbesserungen
- Feature-Rueckblick
- gezielter Wiederaufnahme eines Themenblocks

### 7. Merge-Regel

Vor einem Merge nach `live` gilt:

- `npm run verify` muss gruen sein
- der Hauptflow des Features wird kurz getestet
- nur dann wird nach `live` uebernommen

Danach kann ein freigegebener `live`-Stand bei Bedarf nach `main` gespiegelt
werden.

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

1. ein Thema pro `feature/*` Branch
2. Quality Gate vor Freigabe
3. Merge nach `live` erst nach erfolgreichem Verify und kurzem Flow-Test
4. Hostinger deployt `live`
5. `main` bleibt als stabile Hauptlinie erhalten
6. UI wird inkrementell erweitert, nicht wild umgebaut
