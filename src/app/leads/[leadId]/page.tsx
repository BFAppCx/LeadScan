import { notFound } from "next/navigation";
import { LeadReviewForm } from "@/components/leads/lead-review-form";
import { AppShell } from "@/components/shell/app-shell";
import { getLeadReviewData } from "@/server/leadcard-data";

type LeadReviewPageProps = {
  params: Promise<{
    leadId: string;
  }>;
};

export default async function LeadReviewPage({ params }: LeadReviewPageProps) {
  const { leadId } = await params;
  const lead = await getLeadReviewData(leadId);

  if (!lead) {
    notFound();
  }

  return (
    <AppShell
      eyebrow="Lead Review"
      title="Visitenkarte pruefen und Lead sauber qualifizieren"
      description="Hier bringst du Karte, Kontaktdaten, Gespraechsnotiz und Quali in einen strukturierten Stand fuer Research und CRM."
    >
      <LeadReviewForm lead={lead} />
    </AppShell>
  );
}
