import { createProvider, registerVehicle, reviewProvider, setVehicleAvailability } from "@/app/actions/providers";
import { AppShell } from "@/components/app/app-shell";
import { CreateProviderForm, ReviewProviderForm, VehicleAvailabilityForm, VehicleForm } from "@/components/providers/provider-forms";
import { requireUser } from "@/lib/auth/session";
import { requirePlatformRole } from "@/lib/auth/authorization";
import { listProviders } from "@/lib/providers/data";

export const dynamic = "force-dynamic";

export default async function ProvidersPage() {
  const user = await requireUser();
  await requirePlatformRole(["afos_operations", "afos_administrator"]);
  const providers = await listProviders();
  const pending = providers.filter((provider) => !["verified", "suspended"].includes(provider.verificationStatus)).length;
  return (
    <AppShell active="Providers & Fleet" email={user.email}>
      <header className="page-heading"><div><span className="operations-kicker">Supply network</span><h1>Fleet providers</h1><p>Register transport companies and individual vehicle owners, verify them, and manage every truck and trailer.</p></div><div className="page-stat"><strong>{providers.length}</strong><span>providers</span></div><div className="page-stat attention"><strong>{pending}</strong><span>requiring review</span></div></header>
      <section className="feature-panel"><div className="panel-heading"><span>New provider</span><h2>Create a provider record</h2><p>This creates a draft verification record. It does not authorize the provider to receive live transport offers.</p></div><CreateProviderForm action={createProvider} /></section>
      <section className="records-section"><div className="records-heading"><div><span>Verification queue</span><h2>Transport providers</h2></div><span>{providers.length} records</span></div>
        {providers.length === 0 ? <div className="records-empty"><strong>No transport providers yet</strong><p>Create the first authorized test provider above.</p></div> :
          <div className="provider-list">{providers.map((provider) => <article className="provider-record" key={provider.id}>
            <div className="provider-summary"><div><span className={`status-chip status-${provider.verificationStatus}`}>{provider.verificationStatus.replaceAll("_", " ")}</span><h3>{provider.name}</h3><p>{provider.providerKind==="individual_owner"?"Individual owner":"Company"} · {provider.registrationNumber || "Registration not provided"}</p></div><div><span>Contact</span><strong>{provider.contactName||"Not provided"}</strong><p>{provider.contactPhone}</p></div><div><span>Fleet</span><strong>{provider.trucks.length} trucks · {provider.trailers.length} trailers</strong><p>Declared: {provider.declaredVehicles??"Not stated"}</p></div></div>
            <div className="fleet-metrics fleet-metrics-wide"><div><span>Declared trucks</span><strong>{provider.declaredVehicles??0}</strong></div><div><span>Registered trucks</span><strong>{provider.fleet.registeredTrucks}</strong></div><div><span>Registered trailers</span><strong>{provider.fleet.registeredTrailers}</strong></div><div><span>Available units</span><strong>{provider.fleet.availableUnits}</strong></div><div><span>Engaged units</span><strong>{provider.fleet.engagedUnits}</strong></div><div><span>Unavailable assets</span><strong>{provider.fleet.unavailableAssets}</strong></div><div><span>Expired documents</span><strong>{provider.fleet.expiredAssets}</strong></div></div>
            {provider.fleet.declaredGap!==0&&<p className="fleet-warning">Fleet mismatch: {provider.fleet.declaredGap>0?`${provider.fleet.declaredGap} declared truck${provider.fleet.declaredGap===1?" is":"s are"} not registered.`:`${Math.abs(provider.fleet.declaredGap)} more truck${provider.fleet.declaredGap===-1?" is":"s are"} registered than declared.`}</p>}
            <details><summary>Register truck or trailer</summary><VehicleForm action={registerVehicle} providerId={provider.id}/><div className="fleet-list">{provider.trucks.map(x=><article key={x.id}><div><span>Truck</span><strong>{x.registration}</strong><small>{x.status}</small></div><VehicleAvailabilityForm action={setVehicleAvailability} id={x.id} kind="truck"/></article>)}{provider.trailers.map(x=><article key={x.id}><div><span>Trailer · {x.size}</span><strong>{x.registration}</strong><small>{x.status}</small></div><VehicleAvailabilityForm action={setVehicleAvailability} id={x.id} kind="trailer"/></article>)}</div></details>
            <details><summary>Review verification</summary><ReviewProviderForm action={reviewProvider} verificationId={provider.verificationId} currentStatus={provider.verificationStatus} /></details>
          </article>)}</div>}
      </section>
    </AppShell>
  );
}
