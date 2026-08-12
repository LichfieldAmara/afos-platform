import { createTransportRequest } from "@/app/actions/requests";
import { AppShell } from "@/components/app/app-shell";
import { CreateRequestForm } from "@/components/requests/request-form";
import { requirePlatformRole } from "@/lib/auth/authorization";
import { requireUser } from "@/lib/auth/session";
import { listTransportRequests } from "@/lib/requests/data";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const user = await requireUser();
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const requests = await listTransportRequests();
  const open = requests.filter((request) => !["completed", "cancelled", "failed"].includes(request.status)).length;
  return <AppShell active="Requests" email={user.email}>
    <header className="page-heading"><div><span className="operations-kicker">Demand intake</span><h1>Transport requests</h1><p>Record a genuine container movement in a few clear steps, including requests received by phone or WhatsApp.</p></div><div className="page-stat"><strong>{requests.length}</strong><span>requests</span></div><div className="page-stat attention"><strong>{open}</strong><span>open</span></div></header>
    <section className="request-create"><div className="panel-heading"><span>New movement</span><h2>Request container transport</h2><p>Required questions are marked by their labels. Optional details can be added after the first call.</p></div><CreateRequestForm action={createTransportRequest} /></section>
    <section className="records-section"><div className="records-heading"><div><span>Demand queue</span><h2>Recent requests</h2></div><span>{requests.length} records</span></div>
      {requests.length === 0 ? <div className="records-empty"><strong>No transport requests yet</strong><p>The first submitted request will appear here with its reference and next status.</p></div> :
      <div className="request-list">{requests.map((request) => <article className="request-record" key={request.id}>
        <div><span className={`status-chip status-${request.status}`}>{request.status.replaceAll("_", " ")}</span><strong>{request.reference}</strong><small>{request.customer}</small></div>
        <div><span>Container</span><strong>{request.quantity} × {request.containerSize}</strong><small>{request.movementType.replaceAll("_", " ")}</small></div>
        <div className="request-route"><span>Route</span><strong>{request.pickup} <i>→</i> {request.destination}</strong><small>Pickup {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(request.requiredAt))}</small></div>
        <div><span>Call</span><strong>{request.contactName}</strong><a href={`tel:${request.contactPhone}`}>{request.contactPhone}</a></div>
      </article>)}</div>}
    </section>
  </AppShell>;
}
