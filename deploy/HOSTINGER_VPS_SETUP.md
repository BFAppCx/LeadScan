# Hostinger VPS Setup

## Empfehlung

Der einfachste produktionsreife Weg fuer LeadScan auf einem Hostinger `VPS` ist:

- `LeadCard` als Docker-Container
- `OCR Worker` als zweiter Docker-Container
- `Caddy` davor fuer HTTPS und Reverse Proxy
- `Supabase` bleibt extern fuer Datenbank, Auth und Storage

## Wichtig

Diese Anleitung gilt fuer einen `VPS`.

Wenn dein Hostinger-Paket nur normales Webhosting ohne Docker/VPS-Zugriff ist, ist dieser Weg nicht passend. Dann wuerde ich empfehlen:

- LeadCard auf `Vercel`
- OCR Worker auf einem kleinen `VPS`

## Ziel-Domains

Beispiel:

- App: `app.deine-domain.de`
- OCR: `ocr.app.deine-domain.de`

## Dateien vorbereiten

### 1. Produktions-Env fuer die App

Datei anlegen:

- `.env.production`

Inhalt aus [`.env.production.example`](C:/Users/Annas/OneDrive/Dokumente/LeadCard/.env.production.example) uebernehmen und ausfuellen.

Wichtig:

- `SELF_HOSTED_OCR_URL` muss auf deinen OCR-Endpunkt zeigen
- Beispiel: `https://ocr.app.deine-domain.de/extract/business-card`

### 2. Env fuer den OCR Worker

Datei anlegen:

- `services/ocr-worker/.env`

Startwert:

```env
OCR_WORKER_SECRET=dein_langes_geheimes_passwort
OCR_ENGINE=paddleocr
OCR_PADDLE_LANG=en
OCR_MAX_IMAGE_BYTES=10485760
```

### 3. Domain in Caddy setzen

Der Compose-Stack erwartet eine Umgebungsvariable `APP_DOMAIN`.

Beispiel:

```bash
APP_DOMAIN=app.deine-domain.de
```

Dann wird:

- `app.deine-domain.de` zur Next.js-App
- `ocr.app.deine-domain.de` zum OCR-Worker

## Auf dem Server deployen

### 1. Repo auf den VPS holen

```bash
git clone https://github.com/BFAppCx/LeadScan.git
cd LeadScan
git checkout feature/business-card-ocr
```

### 2. Env-Dateien anlegen

- `.env.production`
- `services/ocr-worker/.env`

### 3. Stack starten

```bash
APP_DOMAIN=app.deine-domain.de docker compose -f docker-compose.hostinger.yml up -d --build
```

### 4. Healthcheck testen

OCR Worker:

```bash
curl https://ocr.app.deine-domain.de/health
```

Antwort:

```json
{"status":"ok"}
```

## LeadCard mit dem Worker verbinden

In `.env.production`:

```env
OCR_PROVIDER=self_hosted
SELF_HOSTED_OCR_URL=https://ocr.app.deine-domain.de/extract/business-card
SELF_HOSTED_OCR_SECRET=dein_langes_geheimes_passwort
```

## Update-Workflow

```bash
git pull
APP_DOMAIN=app.deine-domain.de docker compose -f docker-compose.hostinger.yml up -d --build
```

## Was ich dir empfehle

Fuer deinen Geschaeftsfall ist das die beste erste Produktarchitektur:

- App und OCR getrennt
- keine persoenliche ChatGPT-Kopplung
- mehrere Nutzer koennen dieselbe Scan-Infrastruktur nutzen
- spaeter leicht erweiterbar um Queue, Rate Limits und Billing
