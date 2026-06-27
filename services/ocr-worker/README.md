# LeadCard OCR Worker

Eigenstaendiger OCR-Service fuer LeadCard.

## Ziel

Dieser Worker liest Visitenkarten fuer mehrere App-Nutzer aus, ohne dass einzelne Nutzer ein persoenliches ChatGPT- oder API-Konto brauchen.

## API Contract

### Request

`POST /extract/business-card`

```json
{
  "mimeType": "image/jpeg",
  "imageBase64": "..."
}
```

Optional kann ein Bearer Secret gesetzt werden:

```http
Authorization: Bearer <OCR_WORKER_SECRET>
```

### Response

```json
{
  "rawText": "Jane Doe\nAcme GmbH\n...",
  "contact": {
    "fullName": "Jane Doe",
    "companyName": "Acme GmbH",
    "jobTitle": "Head of Sales",
    "email": "jane@acme.de",
    "phone": "+49 171 1234567",
    "linkedinUrl": "",
    "website": "https://acme.de"
  }
}
```

## Lokal starten

```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

## LeadCard verbinden

In der Haupt-App:

```env
OCR_PROVIDER=self_hosted
SELF_HOSTED_OCR_URL=https://dein-ocr-service.tld/extract/business-card
SELF_HOSTED_OCR_SECRET=dein_secret
```

## Empfehlung fuer Produktion

- Worker getrennt von der Next.js-App deployen
- Bearer Secret setzen
- Logs aktivieren
- spaeter Queue/Bulk-Verarbeitung ergaenzen

## Hinweis

Die erste Version nutzt `PaddleOCR` plus einfache Heuristiken zur Feldzuordnung. Das ist bewusst kostenschonend und austauschbar.
