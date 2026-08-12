const workflow = [
  "Demand",
  "Capacity",
  "Match",
  "Accept",
  "Allocate",
  "Dispatch",
  "Deliver",
  "Complete",
];

const foundations = [
  {
    number: "01",
    title: "Source controlled",
    detail: "Every approved change is recorded and reviewed through GitHub.",
  },
  {
    number: "02",
    title: "Deployment ready",
    detail: "The application is configured for preview and production on Vercel.",
  },
  {
    number: "03",
    title: "Database next",
    detail: "Supabase will provide secure users, operational data, and documents.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="page-title">
        <nav className="nav" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="AFOS home">
            <span className="brand-mark" aria-hidden="true">
              A
            </span>
            <span>
              <strong>AFOS</strong>
              <small>African Freight Operating System</small>
            </span>
          </a>
          <span className="status">
            <span className="status-dot" aria-hidden="true" />
            Foundation live
          </span>
        </nav>

        <div id="top" className="hero-content">
          <div className="eyebrow">Container transport coordination · Sierra Leone</div>
          <h1 id="page-title">
            Moving container transport from fragmented calls to one clear
            workflow.
          </h1>
          <p className="hero-copy">
            AFOS is being built to connect genuine transport demand with
            verified available capacity—and coordinate every movement through
            delivery.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#foundation">
              View project foundation
            </a>
            <span>Mobile-first web application</span>
          </div>
        </div>

        <div className="workflow" aria-label="AFOS transport workflow">
          {workflow.map((step, index) => (
            <div className="workflow-step" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="foundation" className="foundation" aria-labelledby="foundation-title">
        <div className="section-heading">
          <span>Build foundation</span>
          <h2 id="foundation-title">Ready for the next controlled step.</h2>
          <p>
            This first release confirms that the AFOS application can move
            safely from GitHub to Vercel before operational features are added.
          </p>
        </div>

        <div className="foundation-grid">
          {foundations.map((item) => (
            <article key={item.number} className="foundation-card">
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>AFOS · MVP pre-build</span>
        <span>Build narrowly. Validate with real transport.</span>
      </footer>
    </main>
  );
}
