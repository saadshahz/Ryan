import { useEffect } from "react";
import { fitWidth } from "./responsiveImage";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";

const images = {
  hero: fitWidth("https://images.unsplash.com/photo-1569169513673-2cecbfc943a9?auto=format&fit=crop&w=2200&q=90"),
  introduction:
    "https://images.unsplash.com/photo-1770756248866-00b8b7c1dd75?auto=format&fit=crop&w=1300&q=88",
  construction:
    "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?auto=format&fit=crop&w=1500&q=88",
  accommodation:
    "https://images.unsplash.com/photo-1614595737683-1740e41bfaac?auto=format&fit=crop&w=1200&q=88",
  realEstate:
    "https://images.unsplash.com/photo-1573918644828-9598c67e680c?auto=format&fit=crop&w=1100&q=86",
  closing:
    fitWidth("https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=2200&q=90"),
};

const metrics = [
  ["15+", "Years of Experience"],
  ["120+", "Projects Delivered"],
  ["3", "Business Verticals"],
  ["100%", "Commitment to Quality"],
];

const values = [
  ["Integrity", "Honest communication and transparent decisions at every stage of every project."],
  ["Precision", "Careful planning and disciplined execution, measured against the highest standards."],
  ["Partnership", "Long-term relationships with clients, partners, and the communities we build in."],
  ["Endurance", "Spaces designed and built to retain their quality and value for generations."],
];

const journey = [
  ["Foundation", "Ryan Group begins with a focus on dependable, quality-led construction."],
  ["Growth", "A growing portfolio of residential and commercial projects across the region."],
  ["Recognition", "A reputation built on delivery, craftsmanship, and client trust."],
  ["Expansion", "New verticals in PG accommodation and real estate, built on the same foundation."],
];

const businesses = [
  {
    key: "current",
    title: "Construction",
    status: "Operational",
    text: "Residential, commercial, and planning-led construction delivered with precision, accountability, and enduring quality.",
    image: images.construction,
    href: "/construction",
  },
  {
    key: "upcoming",
    title: "PG Accommodation",
    status: "Coming Soon",
    text: "Thoughtfully managed living spaces offering comfort, safety, and convenience for students and professionals.",
    image: images.accommodation,
  },
  {
    key: "upcoming",
    title: "Real Estate",
    status: "Coming Soon",
    text: "Considered property development and advisory focused on long-term value and purposeful places.",
    image: images.realEstate,
  },
];

function AboutPage() {
  useEffect(() => {
    document.title = "About Ryan Group | Building Enduring Spaces";
  }, []);

  return (
    <RevealPage>
      <div className="site">
        <PageHeader active="About Us" />
        <main>
          <section
            id="about-top"
            className="about-hero"
            style={{ backgroundImage: `url(${images.hero})` }}
          >
            <div className="about-hero-overlay" />
            <div className="container about-hero-content">
              <div className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <strong>About Us</strong>
              </div>
              <div className="hero-eyebrow">
                RYAN GROUP <span /> OUR STORY
              </div>
              <h1>
                Built on Integrity.
                <br />
                <em>Driven by Purpose.</em>
              </h1>
              <p>
                A diversified group founded on construction excellence, shaping enduring spaces
                and building a thoughtful vision for the future of property.
              </p>
            </div>
            <div className="about-hero-marker">
              <span>EST. RYAN GROUP</span>
              <i />
            </div>
          </section>

          <section className="section intro-section">
            <div className="container intro-grid">
              <div className="intro-visual reveal">
                <div className="intro-image">
                  <img loading="lazy" decoding="async" src={images.introduction} alt="Ryan Group construction site" />
                </div>
                <div className="about-experience-badge">
                  <strong>15+</strong>
                  <span>
                    Years of
                    <br />
                    Building
                  </span>
                </div>
              </div>
              <div className="intro-copy">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    WHO WE ARE
                  </div>
                  <h2>
                    A Foundation of Quality.
                    <br />
                    <em>A Vision for Tomorrow.</em>
                  </h2>
                </div>
                <p className="intro-lead reveal">
                  Ryan Group was built on a simple belief: that every space deserves care,
                  precision, and an uncompromising standard of quality.
                </p>
                <p className="body-copy reveal">
                  From our roots in construction, we have grown into a group that brings the same
                  discipline to every venture. Our work is defined by thoughtful planning, honest
                  partnerships, and spaces built to stand the test of time.
                </p>
                <div className="about-compact-values reveal">
                  <span>
                    <small>01</small> Integrity
                  </span>
                  <span>
                    <small>02</small> Precision
                  </span>
                  <span>
                    <small>03</small> Endurance
                  </span>
                </div>
                <blockquote className="intro-quote reveal">
                  “We do not simply build structures. We build trust, one project at a time.”
                </blockquote>
              </div>
            </div>
          </section>

          <section className="section group-overview">
            <div className="container">
              <div className="glance-heading reveal">
                <div>
                  <span className="glance-index">01</span>
                  <h2>
                    Ryan Group <em>at a Glance</em>
                  </h2>
                </div>
                <p>Illustrative figures</p>
              </div>
              <div className="metrics-grid reveal">
                {metrics.map(([value, label], index) => (
                  <div className="metric" key={label}>
                    <span>0{index + 1}</span>
                    <strong>{value}</strong>
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mission-vision">
            <div className="mission-block reveal">
              <span className="mv-number">01</span>
              <div className="mv-symbol">
                <i />
                <i />
              </div>
              <div>
                <span className="mv-label">OUR MISSION</span>
                <h2>
                  To Build With
                  <br />
                  <em>Uncompromising Care.</em>
                </h2>
                <p>
                  To deliver spaces of lasting quality through integrity, thoughtful design, and
                  disciplined execution, creating value for every client and community we serve.
                </p>
              </div>
            </div>
            <div className="vision-block reveal">
              <span className="mv-number">02</span>
              <div className="mv-symbol">
                <i />
                <i />
              </div>
              <div>
                <span className="mv-label">OUR VISION</span>
                <h2>
                  To Shape the Future
                  <br />
                  <em>of Property.</em>
                </h2>
                <p>
                  To grow into a trusted, diversified property group, recognised for enduring
                  spaces across construction, accommodation, and real estate.
                </p>
              </div>
            </div>
          </section>

          <section className="section about-values">
            <div className="container">
              <div className="section-title centered reveal">
                <div className="eyebrow">
                  <span />
                  OUR VALUES
                </div>
                <h2>
                  The Principles <em>Behind Our Work.</em>
                </h2>
              </div>
              <div className="about-values-grid">
                {values.map(([title, text], index) => (
                  <article className="about-value-card reveal" key={title}>
                    <span className="about-value-number">0{index + 1}</span>
                    <div className={`value-glyph glyph-${index + 1}`}>
                      <i />
                      <b />
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section journey-section">
            <div className="container">
              <div className="section-title light reveal">
                <div className="eyebrow">
                  <span />
                  OUR JOURNEY
                </div>
                <h2>
                  A Story of <em>Steady Growth.</em>
                </h2>
              </div>
              <div className="journey-timeline">
                {journey.map(([title, text], index) => (
                  <div className="journey-step reveal" key={title}>
                    <div className="timeline-marker">
                      <i />
                      <span>0{index + 1}</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="business-verticals" className="section about-businesses refined-verticals">
            <div className="container">
              <div className="about-businesses-heading">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    OUR BUSINESSES
                  </div>
                  <h2>
                    One Group.
                    <br />
                    <em>Distinct Verticals.</em>
                  </h2>
                </div>
                <p className="reveal">
                  Construction is our foundation. PG accommodation and real estate are the next
                  chapters, built on the same commitment to quality.
                </p>
              </div>
              <div className="about-business-grid">
                {businesses.map((business, index) => (
                  <article
                    className={`about-business-card ${business.key} reveal`}
                    key={business.title}
                  >
                    <div className="about-business-image">
                      <img loading="lazy" decoding="async" src={business.image} alt="" />
                      <span className="vertical-number">0{index + 1}</span>
                    </div>
                    <div className="about-business-copy">
                      <span className="status">{business.status}</span>
                      <h3>{business.title}</h3>
                      <p>{business.text}</p>
                      {business.href ? (
                        <a href={business.href} className="business-explore">
                          Explore <Arrow />
                        </a>
                      ) : (
                        <span className="business-explore muted">Launching Soon</span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            className="about-closing"
            style={{ backgroundImage: `url(${images.closing})` }}
          >
            <div className="about-closing-overlay" />
            <div className="container about-closing-content reveal">
              <div className="hero-eyebrow">
                LET&apos;S BUILD <span /> TOGETHER
              </div>
              <h2>
                Have a Vision in Mind?
                <br />
                <em>Let&apos;s Make It Real.</em>
              </h2>
              <p>Speak with our team about your next project.</p>
              <div className="contact-actions">
                <a href="/contacts" className="button golden-button">
                  Start a Conversation <Arrow />
                </a>
                <a href="/projects" className="button button-ghost">
                  View Our Projects <Arrow />
                </a>
              </div>
            </div>
          </section>
        </main>
        <PageFooter topId="about-top" />
      </div>
    </RevealPage>
  );
}

export default AboutPage;
