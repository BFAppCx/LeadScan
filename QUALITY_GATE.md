# Quality Gate

## Ziel

Bevor neuer Code gespeichert oder veroeffentlicht wird, soll LeadCard automatisch pruefen, ob der Stand technisch sauber ist.

## Was automatisiert passiert

### Vor jedem Commit

Git startet automatisch:

- `npm run verify:quick`

Das bedeutet aktuell:

- TypeScript muss ohne Fehler durchlaufen

### Vor jedem Push

Git startet automatisch:

- `npm run verify`

Das bedeutet aktuell:

- TypeScript muss ohne Fehler durchlaufen
- der Produktions-Build muss erfolgreich sein

## Warum diese Aufteilung?

So bleibt der Alltag schnell:

- Commit bleibt leichtgewichtig
- Push prueft den kompletten Stand

## Wichtige Scripts

- `npm run verify:quick`
- `npm run verify`

## Hook-Pfad

Die Hooks liegen in:

- `.githooks/pre-commit`
- `.githooks/pre-push`

Das Repository wird so konfiguriert, dass Git genau diese Hooks nutzt.
