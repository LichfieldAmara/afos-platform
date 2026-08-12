import Image from "next/image";
import Link from "next/link";

const flow = ["Request", "Verify capacity", "Match", "Allocate", "Dispatch", "Deliver"];

const audiences = [
  { number: "01", title: "For cargo teams", copy: "Submit container movements, confirm capacity, follow milestones and keep delivery evidence in one operational record." },
  { number: "02", title: "For transport providers", copy: "Present verified assets, declare genuine availability, respond to relevant opportunities and coordinate assigned work." },
  { number: "03", title: "For AFOS Operations", copy: "See waiting demand, fragmented capacity, provider responses, active trips and exceptions before coordination breaks down." },
];

export default function Home() {
  return (
    <main className="marketing-page">
      <section className="marketing-hero">
        <Image className="marketing-hero-image" src="/images/afos-container-transport-hero.jpg" alt="Container truck moving near a coastal container terminal" fill priority sizes="100vw" />
        <div className="marketing-overlay" />
        <nav className="marketing-nav" aria-label="Public navigation">
          <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>African Freight Operating System</small></span></Link>
          <div className="marketing-links"><a href="#platform">Platform</a><a href="#workflow">How it works</a><Link className="nav-login" href="/login">Pilot sign in <span aria-hidden="true">↗</span></Link></div>
        </nav>
        <div className="marketing-hero-content">
          <span className="marketing-kicker">Container transport coordination · Sierra Leone</span>
          <h1>Capacity exists.<br />AFOS makes it move.</h1>
          <p>Connect genuine container-transport demand with verified available trucks, trailers and drivers—then coordinate every movement through delivery.</p>
          <div className="marketing-actions"><Link className="marketing-primary" href="/login">Enter pilot platform <span>↗</span></Link><a className="marketing-secondary" href="#workflow">See the coordination flow</a></div>
        </div>
        <div className="hero-proof"><div><span>01</span><strong>Real demand</strong></div><div><span>02</span><strong>Verified capacity</strong></div><div><span>03</span><strong>Traceable delivery</strong></div></div>
      </section>

      <section id="platform" className="manifesto">
        <span className="section-index">01 / The problem</span>
        <div><h2>Transport demand and capacity should not depend on fragmented calls.</h2><p>When one provider cannot satisfy a request, suitable capacity may still exist elsewhere. AFOS creates the shared operating layer needed to discover it, commit it and move the container with accountability.</p></div>
      </section>

      <section id="workflow" className="marketing-workflow">
        <div className="workflow-intro"><span className="section-index">02 / One workflow</span><h2>From requirement to completed movement.</h2><p>The MVP stays focused on the transaction that matters: securing suitable capacity and coordinating it through a real delivery.</p></div>
        <ol>{flow.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2,"0")}</span><strong>{step}</strong><i aria-hidden="true">→</i></li>)}</ol>
      </section>

      <section className="audience-section">
        <div className="audience-heading"><span className="section-index">03 / Built for the network</span><h2>One transport record.<br />Different operational views.</h2></div>
        <div className="audience-grid">{audiences.map((item) => <article key={item.number}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.copy}</p></div></article>)}</div>
      </section>

      <section className="pilot-callout"><div><span>Controlled real-world validation</span><h2>Built narrowly.<br />Tested with real transport.</h2></div><div><p>AFOS is in MVP development for a controlled Sierra Leone pilot. Expansion will follow evidence from fulfilment, response time, capacity accuracy and completed movements.</p><Link href="/login">Authorized pilot access <span>↗</span></Link></div></section>

      <footer className="marketing-footer"><div className="brand"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>African Freight Operating System</small></span></div><p>Build narrowly. Test with real transport.<br />Expand only on evidence.</p><span>Freetown · Sierra Leone</span></footer>
    </main>
  );
}
