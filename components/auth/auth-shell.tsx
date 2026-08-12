import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  copy,
  children,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="auth-context">
        <Link className="brand auth-brand" href="/">
          <span className="brand-mark" aria-hidden="true">A</span>
          <span><strong>AFOS</strong><small>African Freight Operating System</small></span>
        </Link>
        <div>
          <span className="auth-kicker">Controlled pilot access</span>
          <h1>Coordinate every movement with a clear operational record.</h1>
          <p>Demand, verified capacity, allocation, dispatch, exceptions and delivery—connected in one accountable workflow.</p>
        </div>
        <small>Initial market · Sierra Leone</small>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{copy}</p>
          {children}
        </div>
      </section>
    </main>
  );
}
