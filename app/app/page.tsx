import { signOut } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";

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
    <main className="operations-shell">
      <aside className="operations-sidebar">
        <Link className="brand" href="/app"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>Operations</small></span></Link>
        <nav aria-label="Operations">
          <Link className="active" href="/app">Overview</Link>
          <span>Requests</span><span>Capacity</span><span>Offers</span><span>Trips</span><span>Exceptions</span><span>Providers</span>
        </nav>
        <form action={signOut}><button className="sidebar-signout" type="submit">Sign out</button></form>
      </aside>
      <section className="operations-main">
        <header className="operations-header">
          <div><span className="operations-kicker">Live coordination</span><h1>Operations overview</h1></div>
          <div className="user-chip"><span>{user.email.slice(0, 1).toUpperCase()}</span><div><strong>Signed in</strong><small>{user.email}</small></div></div>
        </header>
        <section className="readiness-banner">
          <div><span>Development environment</span><h2>Foundation ready for controlled test data</h2><p>The operational schema must be applied and verified before real records appear here.</p></div>
          <strong>Database gate pending</strong>
        </section>
        <section className="queue-grid" aria-label="Operational summary">
          {queues.map((queue) => <article key={queue.label}><span>{queue.label}</span><strong>{queue.value}</strong><small>{queue.note}</small></article>)}
        </section>
        <section className="work-queue">
          <div><span>Priority queue</span><h2>Nothing requires action yet</h2><p>Once pilot test data is introduced, requests, provider responses, trips and exceptions will appear here in order of operational urgency.</p></div>
          <span className="empty-mark">00</span>
        </section>
      </section>
    </main>
  );
}
