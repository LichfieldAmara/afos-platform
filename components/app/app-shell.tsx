import Link from "next/link";
import { signOut } from "@/app/actions/auth";

const navigation = [
  ["Overview", "/app"], ["Requests", "/app/requests"], ["Capacity", "/app/capacity"],
  ["Matching", "/app/matching"], ["Offers", "/app/offers"], ["Trips", "/app/trips"], ["Exceptions", "/app/exceptions"], ["Providers", "/app/providers"],
];

export function AppShell({ active, email, children }: { active: string; email: string; children: React.ReactNode }) {
  return (
    <main className="operations-shell">
      <aside className="operations-sidebar">
        <Link className="brand" href="/" aria-label="AFOS public homepage"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>Operations</small></span></Link>
        <nav aria-label="Operations">{navigation.map(([label, href]) => <Link className={active === label ? "active" : ""} key={label} href={href}>{label}</Link>)}</nav>
        <form action={signOut}><button className="sidebar-signout" type="submit">Sign out</button></form>
      </aside>
      <section className="operations-main">
        <div className="shell-user"><span>{email.slice(0,1).toUpperCase()}</span><small>{email}</small></div>
        {children}
      </section>
    </main>
  );
}
