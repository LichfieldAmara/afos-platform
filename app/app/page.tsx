import { requireUser } from "@/lib/auth/session";
import { AppShell } from "@/components/app/app-shell";
import { operationalData } from "@/lib/operations/data";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const user = await requireUser();
  const data = await operationalData();
  const waiting = data.requests.filter((item) => ["submitted", "matching"].includes(item.status)).length;
  const unanswered = data.offers.filter((item) => item.status === "sent").length;
  const queues = [
    { label: "Requests waiting", value: waiting, note: "Need suitable capacity" },
    { label: "Capacity available", value: data.capacity.length, note: "Provider declarations" },
    { label: "Offers unanswered", value: unanswered, note: "Provider response required" },
    { label: "Trips scheduled", value: data.trips.length, note: "Allocated movements" },
  ];
  const priority = unanswered > 0 ? `${unanswered} provider response${unanswered === 1 ? "" : "s"} need follow-up` : waiting > 0 ? `${waiting} request${waiting === 1 ? "" : "s"} need matching` : "Nothing requires action yet";
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
          <div><span>Priority queue</span><h2>{priority}</h2><p>Review unanswered offers first, then match waiting demand with verified capacity.</p></div>
          <span className="empty-mark">{String(unanswered || waiting).padStart(2, "0")}</span>
        </section>
    </AppShell>
  );
}
