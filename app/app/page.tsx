import { requireUser } from "@/lib/auth/session";
import { AppShell } from "@/components/app/app-shell";
import { getOperationsOverview } from "@/lib/operations/overview";

export const dynamic = "force-dynamic";

export default async function AppHome() {
  const user = await requireUser();
  const data = await getOperationsOverview();
  const queues = [
    { label: "New requests", value: data.newRequests, note: "Recently submitted" },
    { label: "Price confirmation", value: data.awaitingPrice, note: "Need an Operations price" },
    { label: "Provider assignment", value: data.awaitingAssignment, note: "Need compatible fleet" },
    { label: "Available fleet units", value: data.availableFleet, note: "Usable truck–trailer pairs" },
    { label: "Vehicles engaged", value: data.engagedVehicles, note: "Assets on active trips" },
    { label: "Trips in progress", value: data.tripsInProgress, note: "Active movements" },
    { label: "Open exceptions", value: data.openExceptions, note: "Need operational action" },
    { label: "Delivered today", value: data.deliveredToday, note: "Completed deliveries" },
  ];
  const priority = data.openExceptions ? `${data.openExceptions} exception${data.openExceptions===1?"":"s"} need attention` : data.awaitingAssignment ? `${data.awaitingAssignment} request${data.awaitingAssignment===1?"":"s"} need provider assignment` : data.awaitingPrice ? `${data.awaitingPrice} request${data.awaitingPrice===1?"":"s"} need a price` : "Nothing requires action yet";
  return (
    <AppShell active="Overview" email={user.email}>
        <header className="operations-header">
          <div><span className="operations-kicker">Live coordination</span><h1>Operations overview</h1></div>
          <div className="user-chip"><span>{user.email.slice(0, 1).toUpperCase()}</span><div><strong>Signed in</strong><small>{user.email}</small></div></div>
        </header>
        <section className="readiness-banner">
          <div><span>Controlled test environment</span><h2>Operations workflow is connected</h2><p>Use authorized test records while the complete workflow is validated with representative users.</p></div>
          <strong>Test data only</strong>
        </section>
        <section className="queue-grid" aria-label="Operational summary">
          {queues.map((queue) => <article key={queue.label}><span>{queue.label}</span><strong>{queue.value}</strong><small>{queue.note}</small></article>)}
        </section>
        <section className="work-queue">
          <div><span>Priority queue</span><h2>{priority}</h2><p>Resolve exceptions first, then confirm prices and assign compatible verified fleet.</p></div>
          <span className="empty-mark">{String(data.openExceptions||data.awaitingAssignment||data.awaitingPrice).padStart(2,"0")}</span>
        </section>
    </AppShell>
  );
}
