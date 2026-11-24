import { useEffect } from "react";
import { site } from "./siteConfig";
import { fitWidth } from "./responsiveImage";
import { PageFooter, PageHeader } from "./PageChrome";
import FeaturedProjectsCarousel from "./FeaturedProjectsCarousel";

const portfolioImages = {
  hero: fitWidth("https://images.unsplash.com/photo-1758193431355-54df41421657?auto=format&fit=crop&w=2200&q=90"),
  philosophy:
    "https://images.unsplash.com/photo-1736774011107-fe132f73ddc1?auto=format&fit=crop&w=1300&q=88",
  closing:
    fitWidth("https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=2200&q=90"),
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="icon">
      <path
        d={diagonal ? "M6 18 18 6M9 6h9v9" : "M5 12h14m-5-5 5 5-5 5"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Heading({
  eyebrow,
  children,
  centered = false,
  light = false,
}: {
  eyebrow: string;
  children: React.ReactNode;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div
      className={`section-title reveal ${centered ? "centered" : ""} ${light ? "light" : ""}`}
    >
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{children}</h2>
    </div>
  );
}

function ProjectsPage() {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Ryan Group Projects | Our Architectural Portfolio";

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && entry.target.classList.add("in-view"),
        ),
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="site projects-page">
      <PageHeader active="Projects" />

      <main>
        <section
          id="projects-top"
          className="portfolio-hero"
          style={{ backgroundImage: `url(${portfolioImages.hero})` }}
        >
          <div className="portfolio-hero-overlay" />
          <div className="container portfolio-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <strong>Projects</strong>
            </div>
            <div className="hero-eyebrow">
              RYAN GROUP <span /> OUR PORTFOLIO
            </div>
            <h1>
              Our Work. Our Commitment.
              <br />
              <em>Our Legacy.</em>
            </h1>
            <p>
              Discover the spaces we&apos;ve brought to life through thoughtful
              construction and a commitment to enduring quality.
            </p>
          </div>
          <div className="portfolio-hero-number">03</div>
        </section>

        <section className="section portfolio-introduction">
          <div className="container">
            <Heading eyebrow="A SELECTION OF OUR WORK" centered>
              Spaces Designed to Stand
              <br />
              the Test of <em>Time</em>
            </Heading>
            <p className="portfolio-intro-copy reveal">
              Every project represents an opportunity to create something
              meaningful. Explore Ryan Group&apos;s portfolio of residential
              developments and villa plots, reflecting our commitment to
              thoughtful planning, quality, and lasting value.
            </p>
          </div>
        </section>

        <section id="our-projects" className="section portfolio-showcase">
          <div className="container">
            <FeaturedProjectsCarousel
              eyebrow="PROJECTS"
              title={
                <>
                  A Portfolio Built
                  <br />
                  with <em>Purpose</em>
                </>
              }
              intro="Three distinctive developments. One enduring approach to quality, thoughtfulness, and value."
              showViewAll={false}
              showEnquiry
            />
          </div>
        </section>

        <section className="section portfolio-highlights">
          <div className="container">
            <Heading eyebrow="PORTFOLIO HIGHLIGHTS" light centered>
              A Foundation of <em>Experience</em>
            </Heading>
            <div className="portfolio-metrics">
              {[
                ["03", "Featured Projects"],
                ["02", "Completed Buildings"],
                ["01", "Now Open for EOI"],
                ["01", "Commitment to Quality"],
              ].map(([number, label], index) => (
                <div className="portfolio-metric reveal" key={label}>
                  <span>0{index + 1}</span>
                  <strong>{number}</strong>
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="project-philosophy" className="section project-philosophy">
          <div className="container philosophy-grid">
            <div className="philosophy-visual reveal">
              <img loading="lazy" decoding="async"
                src={portfolioImages.philosophy}
                alt="Monochrome architectural facade detail"
              />
              <div className="philosophy-corner top" />
              <div className="philosophy-corner bottom" />
              <span>DETAIL / INTENT / VALUE</span>
            </div>
            <div className="philosophy-copy">
              <Heading eyebrow="OUR APPROACH">
                Every Project Reflects
                <br />
                Our <em>Purpose</em>
              </Heading>
              <div className="philosophy-line reveal" />
              <p className="reveal">
                At Ryan Group, each project is approached with a focus on
                thoughtful planning, quality craftsmanship, and long-term value.
                We believe the spaces we create should reflect both purpose and
                enduring design.
              </p>
              <a href="/construction" className="text-link reveal">
                Explore Our Approach <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section
          id="projects-contact"
          className="portfolio-closing"
          style={{ backgroundImage: `url(${portfolioImages.closing})` }}
        >
          <div className="portfolio-closing-overlay" />
          <div className="container portfolio-closing-content reveal">
            <span className="contact-kicker">START A CONVERSATION</span>
            <h2>
              Have a Vision for
              <br />
              Your Next <em>Project?</em>
            </h2>
            <p>Let&apos;s create something meaningful together.</p>
            <div className="contact-actions">
              <a
                href={`mailto:${site.email}`}
                className="button golden-button"
              >
                Discuss a Project <Arrow />
              </a>
              <a href="/contacts" className="button button-outline">
                Contact Ryan Group <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
      </main>

      <PageFooter topId="projects-top" />
    </div>
  );
}

export default ProjectsPage;
