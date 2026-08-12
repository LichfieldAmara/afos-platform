import { requireUser } from "@/lib/auth/session";
import { AppShell } from "@/components/app/app-shell";

export const dynamic = "force-dynamic";

const queues = [
  { label: "Requests waiting", value: "—", note: "Awaiting first pilot data" },
  { label: "Capacity available", value: "—", note: "Provider declarations" },
  { label: "Offers unanswered", value: "—", note: "Provider response required" },
  { label: "Open exceptions", value: "—", note: "Operational attention" },
];

export default async function AppHome() {
  const user = await requireUser();
  return (
    <AppShell active="Overview" email={user.email}>
        <header className="operations-header">
          <div><span className="operations-kicker">Live coordination</span><h1>Operations overview</h1></div>
          <div className="user-chip"><span>{user.email.slice(0, 1).toUpperCase()}</span><div><strong>Signed in</strong><small>{user.email}</small></div></div>
        </header>
        <section className="readiness-banner">
          <div><span>Development environment</span><h2>Core schema verified and administrator access active</h2><p>Use authorized test records only while the operational workflows are being implemented and validated.</p></div>
          <strong>Test data only</strong>
        </section>
        <section className="queue-grid" aria-label="Operational summary">
          {queues.map((queue) => <article key={queue.label}><span>{queue.label}</span><strong>{queue.value}</strong><small>{queue.note}</small></article>)}
        </section>
        <section className="work-queue">
          <div><span>Priority queue</span><h2>Nothing requires action yet</h2><p>Once pilot test data is introduced, requests, provider responses, trips and exceptions will appear here in order of operational urgency.</p></div>
          <span className="empty-mark">00</span>
        </section>
    </AppShell>
  );
}
