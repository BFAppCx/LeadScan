type OpenAiBusinessCardSuggestion = {
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

function getOpenAiApiKey() {
  return process.env.OPENAI_API_KEY?.trim() || "";
}

export function hasOpenAiApiKey() {
  return Boolean(getOpenAiApiKey());
}

export function getOpenAiOcrModel() {
  return process.env.OPENAI_OCR_MODEL?.trim() || "gpt-4o-mini";
}

export async function extractBusinessCardWithOpenAi(
  imageBytes: Uint8Array,
  mimeType: string
): Promise<OpenAiBusinessCardSuggestion> {
  const apiKey = getOpenAiApiKey();

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY fehlt noch.");
  }

  const base64Image = Buffer.from(imageBytes).toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Image}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: getOpenAiOcrModel(),
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

  return JSON.parse(payload.output_text) as OpenAiBusinessCardSuggestion;
}
