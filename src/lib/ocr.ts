export type BusinessCardExtraction = {
  rawText: string;
  contact: {
    fullName: string;
    companyName: string;
    jobTitle: string;
    email: string;
    phone: string;
    linkedinUrl: string;
    website: string;
  };
};

type OcrProvider = "self_hosted" | "openai" | "disabled";

const DEFAULT_SELF_HOSTED_OCR_URL =
  "https://ocr.leadscan.marktformsales.de/extract/business-card";

function getSelfHostedOcrUrl() {
  return process.env.SELF_HOSTED_OCR_URL?.trim() || DEFAULT_SELF_HOSTED_OCR_URL;
}

function getOcrProvider(): OcrProvider {
  const value = process.env.OCR_PROVIDER?.trim().toLowerCase();

  if (value === "self_hosted" || value === "openai" || value === "disabled") {
    return value;
  }

  if (getSelfHostedOcrUrl()) {
    return "self_hosted";
  }

  if (process.env.OPENAI_API_KEY?.trim()) {
    return "openai";
  }

  return "disabled";
}

export function getConfiguredOcrProvider() {
  return getOcrProvider();
}

function emptyExtraction(): BusinessCardExtraction {
  return {
    rawText: "",
    contact: {
      fullName: "",
      companyName: "",
      jobTitle: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      website: ""
    }
  };
}

async function extractWithSelfHosted(
  imageBytes: Uint8Array,
  mimeType: string
): Promise<BusinessCardExtraction> {
  const endpoint = getSelfHostedOcrUrl();

  const sharedSecret = process.env.SELF_HOSTED_OCR_SECRET?.trim();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(sharedSecret ? { Authorization: `Bearer ${sharedSecret}` } : {})
    },
    body: JSON.stringify({
      mimeType,
      imageBase64: Buffer.from(imageBytes).toString("base64")
    })
  });

  if (!response.ok) {
    const errorText = await response.text();

    if (response.status === 401) {
      throw new Error(
        "Self-hosted OCR lehnt die Anfrage ab. Bitte SELF_HOSTED_OCR_SECRET in der App-Umgebung pruefen."
      );
    }

    if (response.status === 404) {
      throw new Error(
        `Self-hosted OCR-Endpunkt nicht gefunden. Bitte SELF_HOSTED_OCR_URL pruefen: ${endpoint}`
      );
    }

    throw new Error(`Self-hosted OCR fehlgeschlagen: ${errorText}`);
  }

  const payload = (await response.json()) as Partial<BusinessCardExtraction>;
  const contact =
    payload.contact && typeof payload.contact === "object"
      ? (payload.contact as Partial<BusinessCardExtraction["contact"]>)
      : {};

  return {
    rawText: typeof payload.rawText === "string" ? payload.rawText : "",
    contact: {
      fullName: typeof contact.fullName === "string" ? contact.fullName : "",
      companyName: typeof contact.companyName === "string" ? contact.companyName : "",
      jobTitle: typeof contact.jobTitle === "string" ? contact.jobTitle : "",
      email: typeof contact.email === "string" ? contact.email : "",
      phone: typeof contact.phone === "string" ? contact.phone : "",
      linkedinUrl: typeof contact.linkedinUrl === "string" ? contact.linkedinUrl : "",
      website: typeof contact.website === "string" ? contact.website : ""
    }
  };
}

async function extractWithOpenAi(
  imageBytes: Uint8Array,
  mimeType: string
): Promise<BusinessCardExtraction> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY fehlt noch.");
  }

  const dataUrl = `data:${mimeType};base64,${Buffer.from(imageBytes).toString("base64")}`;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_OCR_MODEL?.trim() || "gpt-4o-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Lies diese Visitenkarte aus. Extrahiere nur Informationen, die im Bild plausibel sichtbar sind. Wenn ein Feld nicht erkennbar ist, gib einen leeren String zurueck."
            },
            {
              type: "input_image",
              image_url: dataUrl,
              detail: "high"
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "business_card_extraction",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              rawText: { type: "string" },
              contact: {
                type: "object",
                additionalProperties: false,
                properties: {
                  fullName: { type: "string" },
                  companyName: { type: "string" },
                  jobTitle: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  linkedinUrl: { type: "string" },
                  website: { type: "string" }
                },
                required: [
                  "fullName",
                  "companyName",
                  "jobTitle",
                  "email",
                  "phone",
                  "linkedinUrl",
                  "website"
                ]
              }
            },
            required: ["rawText", "contact"]
          }
        }
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI OCR fehlgeschlagen: ${errorText}`);
  }

  const payload = (await response.json()) as { output_text?: string };

  if (!payload.output_text) {
    throw new Error("OpenAI OCR hat keine strukturierte Antwort geliefert.");
  }

  return JSON.parse(payload.output_text) as BusinessCardExtraction;
}

export async function extractBusinessCard(
  imageBytes: Uint8Array,
  mimeType: string
): Promise<{ provider: string; extraction: BusinessCardExtraction }> {
  const provider = getOcrProvider();

  if (provider === "disabled") {
    throw new Error(
      "Noch kein OCR-Provider konfiguriert. Aktiviere OCR_PROVIDER=self_hosted oder hinterlege SELF_HOSTED_OCR_URL."
    );
  }

  if (provider === "self_hosted") {
    return {
      provider: "self_hosted",
      extraction: await extractWithSelfHosted(imageBytes, mimeType)
    };
  }

  if (provider === "openai") {
    return {
      provider: "openai",
      extraction: await extractWithOpenAi(imageBytes, mimeType)
    };
  }

  return {
    provider: "disabled",
    extraction: emptyExtraction()
  };
}
