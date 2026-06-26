import { NewLeadForm } from "@/components/leads/new-lead-form";
import { AppShell } from "@/components/shell/app-shell";
import {
  getClientsData,
  getEventsData,
  getQualificationQuestions
} from "@/server/leadcard-data";

export default async function NewLeadPage() {
  const [clients, events, qualificationQuestions] = await Promise.all([
    getClientsData(),
    getEventsData(),
    getQualificationQuestions()
  ]);

  return (
    <AppShell
      eyebrow="New Lead"
      title="Lead in unter 90 Sekunden erfassen"
      description="Der Einstieg bleibt bewusst kompakt: Quelle waehlen, Client taggen, Gespraech notieren und direkt qualifizieren."
    >
      <NewLeadForm
        clients={clients}
        events={events}
        qualificationQuestions={qualificationQuestions}
      />
    </AppShell>
  );
}
