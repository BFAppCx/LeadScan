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
  const warning = clients.warning ?? events.warning;

  return (
    <AppShell
      eyebrow="New Lead"
      title="Lead in unter 90 Sekunden erfassen"
      description="Der Einstieg bleibt bewusst kompakt: Quelle waehlen, Client taggen, Gespraech notieren und direkt qualifizieren."
    >
      {warning ? <p className="form-notice form-notice-warning">{warning}</p> : null}
      <NewLeadForm
        clients={clients.data}
        events={events.data}
        qualificationQuestions={qualificationQuestions}
      />
    </AppShell>
  );
}
