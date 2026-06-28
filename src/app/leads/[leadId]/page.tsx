import { notFound } from "next/navigation";
import { LeadReviewForm } from "@/components/leads/lead-review-form";
import { AppShell } from "@/components/shell/app-shell";
import { requireAuthenticatedUser } from "@/server/leadcard-auth";
import { getLeadReviewData } from "@/server/leadcard-data";

type LeadReviewPageProps = {
  params: Promise<{
    leadId: string;
  }>;
  searchParams?: Promise<{
    created?: string;
    ocr?: string;
  }>;
};

export default async function LeadReviewPage({ params, searchParams }: LeadReviewPageProps) {
  await requireAuthenticatedUser();
  const { leadId } = await params;
  const resolvedSearchParams = await searchParams;
  const lead = await getLeadReviewData(leadId);

  if (!lead) {
    notFound();
  }

  let flowNotice: string | undefined;

  if (resolvedSearchParams?.created === "1") {
    if (resolvedSearchParams.ocr === "done") {
      flowNotice = "Lead wurde gespeichert und der OCR-Vorschlag ist bereits geladen.";
    } else if (resolvedSearchParams.ocr === "failed") {
      flowNotice =
        "Lead wurde gespeichert, aber OCR konnte noch nicht automatisch gelesen werden. Du kannst den OCR-Lauf hier erneut starten.";
    } else {
      flowNotice =
        "Lead wurde gespeichert. Wenn dein OCR-Service spaeter verbunden ist, kannst du die Karte hier direkt auslesen.";
    }
  }

  return (
    <AppShell
      eyebrow="Lead Review"
      title="Visitenkarte pruefen und Lead sauber qualifizieren"
      description="Hier bringst du Karte, Kontaktdaten, Gespraechsnotiz und Quali in einen strukturierten Stand fuer Research und CRM."
    >
      <LeadReviewForm lead={lead} flowNotice={flowNotice} />
    </AppShell>
  );
}
