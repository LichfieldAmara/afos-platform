import { createProvider, reviewProvider } from "@/app/actions/providers";
import { AppShell } from "@/components/app/app-shell";
import { CreateProviderForm, ReviewProviderForm } from "@/components/providers/provider-forms";
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
    <AppShell active="Providers" email={user.email}>
      <header className="page-heading"><div><span className="operations-kicker">Supply network</span><h1>Providers</h1><p>Register transport organizations, monitor verification, and preserve a traceable decision record.</p></div><div className="page-stat"><strong>{providers.length}</strong><span>registered</span></div><div className="page-stat attention"><strong>{pending}</strong><span>requiring review</span></div></header>
      <section className="feature-panel"><div className="panel-heading"><span>New provider</span><h2>Create a provider record</h2><p>This creates a draft verification record. It does not authorize the provider to receive live transport offers.</p></div><CreateProviderForm action={createProvider} /></section>
      <section className="records-section"><div className="records-heading"><div><span>Verification queue</span><h2>Transport providers</h2></div><span>{providers.length} records</span></div>
        {providers.length === 0 ? <div className="records-empty"><strong>No transport providers yet</strong><p>Create the first authorized test provider above.</p></div> :
          <div className="provider-list">{providers.map((provider) => <article className="provider-record" key={provider.id}>
            <div className="provider-summary"><div><span className={`status-chip status-${provider.verificationStatus}`}>{provider.verificationStatus.replaceAll("_", " ")}</span><h3>{provider.name}</h3><p>{provider.registrationNumber || "Registration not provided"} · {provider.contactName || "No operational contact"}</p></div><div><span>Contact</span><strong>{provider.contactPhone || "Not provided"}</strong></div><div><span>Last updated</span><strong>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(provider.updatedAt))}</strong></div></div>
            <details><summary>Review verification</summary><ReviewProviderForm action={reviewProvider} verificationId={provider.verificationId} currentStatus={provider.verificationStatus} /></details>
          </article>)}</div>}
      </section>
    </AppShell>
  );
}

