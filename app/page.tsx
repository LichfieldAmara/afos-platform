import Image from "next/image";
import Link from "next/link";

const whatsappEnquiry =
  "https://wa.me/23299507223?text=Hello%20AFOS%2C%20I%20would%20like%20to%20enquire%20about%20container%20transport.";

export default function Home() {
  return (
    <main className="marketing-page">
      <section className="marketing-hero">
        <Image className="marketing-hero-image" src="/images/afos-container-transport-hero.jpg" alt="Container truck moving near a coastal container terminal" fill priority sizes="100vw" />
        <div className="marketing-overlay" />
        <nav className="marketing-nav">
          <Link className="brand" href="/"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>African Fleet Operating System</small></span></Link>
          <Link className="nav-login" href="/request">Request transport <span>↗</span></Link>
        </nav>
        <div className="marketing-hero-content">
          <span className="marketing-kicker">Container transport · Sierra Leone</span>
          <h1><span>Need transport</span> <span>for your container?</span></h1>
          <p>Tell us where your container is, where it needs to go, and when. AFOS will coordinate suitable transport and contact you.</p>
          <div className="marketing-actions"><Link className="marketing-primary" href="/request">Request transport <span>↗</span></Link></div>
        </div>
        <div className="hero-proof"><div><span>01</span><strong>Send your request</strong></div><div><span>02</span><strong>AFOS reviews it</strong></div><div><span>03</span><strong>We contact you</strong></div></div>
      </section>

      <section className="manifesto">
        <span className="section-index">HOW IT WORKS</span>
        <div><h2>One request. AFOS coordinates the transport.</h2><p>Tell us how many trucks or trailers you need, where they should collect from, where they should deliver, and when they are required.</p><Link className="marketing-primary dark-action" href="/request">Send a request <span>→</span></Link></div>
      </section>

      <section className="enquiry-section" aria-labelledby="enquiry-heading">
        <div><span className="section-index">NOT READY TO REQUEST?</span><h2 id="enquiry-heading">Have a question first?</h2><p>Speak directly with AFOS about your container transport needs. No form or account is required.</p></div>
        <div className="enquiry-actions"><a className="enquiry-primary" href={whatsappEnquiry}>WhatsApp AFOS <span>↗</span></a><a className="enquiry-secondary" href="tel:+23299507223">Call +232 99 507223</a></div>
      </section>

      <footer className="marketing-footer">
        <div className="brand"><span className="brand-mark">A</span><span><strong>AFOS</strong><small>African Fleet Operating System</small></span></div>
        <p>Container transport coordination.<br /><a href="tel:+23299507223">+232 99 507223</a></p>
        <span>Freetown · Sierra Leone</span>
      </footer>
    </main>
  );
}
