# Hostinger VPS Setup

## Empfehlung

Der stabilste Weg fuer LeadScan auf einem Hostinger `VPS` ist:

- `LeadCard` als Docker-Container
- `OCR Worker` als zweiter Docker-Container
- vorhandenes `Traefik` auf dem VPS fuer HTTPS und Routing
- `Supabase` bleibt extern fuer Datenbank, Auth und Storage
- keine lokalen `build:`-Deploys im Docker Manager, sondern vorgebaute Images

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

### 3. Domains und Traefik-Netzwerk setzen

Der image-basierte Compose-Stack erwartet:

```env
APP_DOMAIN=leadscan.marktformsales.de
OCR_DOMAIN=ocr.leadscan.marktformsales.de
TRAEFIK_NETWORK=traefik-proxy
```

## GitHub Images vorbereiten

Die Datei [publish-images.yml](C:/Users/Annas/OneDrive/Dokumente/LeadCard/.github/workflows/publish-images.yml)
baut bei jedem Push auf `live` zwei GHCR-Images:

- `ghcr.io/bfappcx/leadscan-app:live`
- `ghcr.io/bfappcx/leadscan-ocr-worker:live`

Wichtig:

- In GitHub Packages beide Container auf `public` setzen, damit Hostinger sie ohne Login ziehen kann.

## Auf dem Server deployen

### 1. Repo auf den VPS holen

```bash
git clone https://github.com/BFAppCx/LeadScan.git
cd LeadScan
git checkout live
```

### 2. Env-Dateien anlegen

- `.env.production`
- `services/ocr-worker/.env`

### 3. Stack starten

Nicht `docker-compose.hostinger.yml`, sondern den image-basierten Stack nutzen:

```bash
APP_DOMAIN=leadscan.marktformsales.de OCR_DOMAIN=ocr.leadscan.marktformsales.de TRAEFIK_NETWORK=traefik-proxy docker compose -f docker-compose.hostinger.images.yml up -d
```

### 4. Healthcheck testen

OCR Worker:

```bash
curl https://ocr.leadscan.marktformsales.de/health
```

Antwort:

```json
{"status":"ok"}
```

## LeadCard mit dem Worker verbinden

In `.env.production`:

```env
OCR_PROVIDER=self_hosted
SELF_HOSTED_OCR_URL=https://ocr.leadscan.marktformsales.de/extract/business-card
SELF_HOSTED_OCR_SECRET=dein_langes_geheimes_passwort
```

## Update-Workflow

```bash
git pull origin live
APP_DOMAIN=leadscan.marktformsales.de OCR_DOMAIN=ocr.leadscan.marktformsales.de TRAEFIK_NETWORK=traefik-proxy docker compose -f docker-compose.hostinger.images.yml up -d
```

## Was ich dir empfehle

Fuer deinen Geschaeftsfall ist das die beste erste Produktarchitektur:

- App und OCR getrennt
- keine persoenliche ChatGPT-Kopplung
- mehrere Nutzer koennen dieselbe Scan-Infrastruktur nutzen
- spaeter leicht erweiterbar um Queue, Rate Limits und Billing
