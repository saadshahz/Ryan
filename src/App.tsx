import { useEffect } from "react";
import { site } from "./siteConfig";
import { fitWidth } from "./responsiveImage";
import { PageFooter, PageHeader } from "./PageChrome";
import AboutPage from "./AboutPage";
import ConstructionPage from "./ConstructionPage";
import ProjectsPage from "./ProjectsPage";
import ProjectDetailPage from "./ProjectDetailPage";
import BlogPage from "./BlogPage";
import BlogArticlePage from "./BlogArticlePage";
import ContactsPage from "./ContactsPage";
import NotFoundPage from "./NotFoundPage";
import FeaturedProjectsCarousel from "./FeaturedProjectsCarousel";
import HomeStories from "./HomeStories";

const images = {
  hero: fitWidth("https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?auto=format&fit=crop&w=2200&q=90"),
  about:
    "https://images.unsplash.com/photo-1614595737476-42487331b8a1?auto=format&fit=crop&w=1200&q=88",
  construction:
    "https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=1000&q=86",
  pg: "https://images.unsplash.com/photo-1453586857165-eb78d44460ca?auto=format&fit=crop&w=1000&q=86",
  realEstate:
    "https://images.unsplash.com/photo-1589360810891-0935e508429a?auto=format&fit=crop&w=1000&q=86",
  vision:
    fitWidth("https://images.unsplash.com/photo-1624204386084-dd8c05e32226?auto=format&fit=crop&w=2200&q=90"),
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

function SectionTitle({
  eyebrow,
  children,
  light = false,
  centered = false,
}: {
  eyebrow: string;
  children: React.ReactNode;
  light?: boolean;
  centered?: boolean;
}) {
  return (
    <div className={`section-title reveal ${light ? "light" : ""} ${centered ? "centered" : ""}`}>
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{children}</h2>
    </div>
  );
}

function App() {
  if (window.location.pathname === "/contacts" || window.location.pathname === "/contacts/") {
    return <ContactsPage />;
  }

  if (window.location.pathname === "/blog" || window.location.pathname === "/blog/") {
    return <BlogPage />;
  }

  const articleMatch = window.location.pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (articleMatch) {
    return <BlogArticlePage slug={decodeURIComponent(articleMatch[1])} />;
  }

  const projectMatch = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
  if (projectMatch) {
    return <ProjectDetailPage slug={decodeURIComponent(projectMatch[1])} />;
  }

  if (window.location.pathname === "/projects" || window.location.pathname === "/projects/") {
    return <ProjectsPage />;
  }

  if (
    window.location.pathname === "/construction" ||
    window.location.pathname === "/construction/"
  ) {
    return <ConstructionPage />;
  }

  if (window.location.pathname === "/about" || window.location.pathname === "/about/") {
    return <AboutPage />;
  }

  // Anything that is not the homepage or a route above is a 404.
  if (!["/", "/index.html"].includes(window.location.pathname)) {
    return <NotFoundPage />;
  }


  useEffect(() => {

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="site">
      <PageHeader active="Home" />

      <main>
        <section id="home" className="hero" style={{ backgroundImage: `url(${images.hero})` }}>
          <div className="hero-overlay" />
          <div className="container
           hero-content">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                RYAN GROUP <span /> CONSTRUCTION &amp; DEVELOPMENT
              </div>
              <h1>
                Built on Trust.
                <br />
                <em>Designed for Tomorrow.</em>
              </h1>
              <p>
                Creating enduring spaces through thoughtful construction, quality craftsmanship, and
                a vision for tomorrow.
              </p>
              <div className="hero-actions">
                <a href="/projects" className="button golden-button">
                  Explore Our Projects <Arrow />
                </a>
                <a href="/about" className="button button-ghost">
                  Discover Ryan Group <Arrow diagonal />
                </a>
              </div>
            </div>
            <div className="hero-index">
              <span>01</span>
              <i />
              <span>05</span>
            </div>
          </div>
          <a href="#construction" className="scroll-cue">
            <span>Scroll to discover</span>
            <i />
          </a>
        </section>

        <HomeStories />

        <section id="construction" className="section expertise-section">
          <div className="blueprint-lines" />
          <div className="container">
            <div className="expertise-heading">
              <SectionTitle eyebrow="OUR EXPERTISE" light>
                Building with Purpose.
                <br />
                Delivering with <em>Precision.</em>
              </SectionTitle>
              <p className="reveal">
                From planning to execution, we approach every project with a commitment to quality,
                attention to detail, and lasting value.
              </p>
            </div>
            <div className="expertise-grid">
              {[
                [
                  "01",
                  "Residential Construction",
                  "Purposeful homes crafted around modern life, comfort, and enduring quality.",
                ],
                [
                  "02",
                  "Commercial Construction",
                  "High-performing spaces that balance business ambition with architectural clarity.",
                ],
                [
                  "03",
                  "Project Planning & Execution",
                  "Precise coordination from first concept through to successful completion.",
                ],
              ].map(([number, title, copy]) => (
                <article className="expertise-card reveal" key={title}>
                  <div className="line-icon">
                    <span />
                    <i />
                    <b />
                  </div>
                  <span className="card-number">{number}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <a href="#projects" aria-label={`Learn about ${title}`}>
                    <Arrow diagonal />
                  </a>
                </article>
              ))}
            </div>
            <a href="#projects" className="button button-outline reveal">
              Explore Our Construction <Arrow />
            </a>
          </div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="container">
            <FeaturedProjectsCarousel />
          </div>
        </section>

        <section id="foundation" className="section foundation-section">
          <div className="container">
            <div className="foundation-top">
              <SectionTitle eyebrow="OUR FOUNDATION">
                The Foundation of
                <br />
                Everything <em>We Build</em>
              </SectionTitle>
              <p className="reveal">
                Our principles guide every decision, every partnership, and every space we bring to
                life.
              </p>
            </div>
            <div className="values-grid">
              {[
                ["Quality First", "We hold every detail to the highest standard."],
                ["Integrity Always", "Trust is the foundation of every relationship."],
                ["Thoughtful Execution", "We plan with care and deliver with precision."],
                ["Long-Term Vision", "We build value designed to endure and evolve."],
              ].map(([title, copy], index) => (
                <article className="value-item reveal" key={title}>
                  <span>0{index + 1}</span>
                  <div className="value-mark" />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vision-section" style={{ backgroundImage: `url(${images.vision})` }}>
          <div className="vision-overlay" />
          <div className="container vision-content reveal">
            <div className="eyebrow light">
              <span /> OUR VISION
            </div>
            <h2>
              Shaping Spaces.
              <br />
              <em>Building Possibilities.</em>
            </h2>
            <p>
              Our vision is to grow beyond construction, creating opportunities across property,
              accommodation, and future development while maintaining the values that define Ryan
              Group.
            </p>
            <a href="/about#business-verticals" className="button golden-button">
              Explore Our Vision <Arrow />
            </a>
          </div>
        </section>

        <section
          id="contact"
          className="contact-section"
          style={{ backgroundImage: `url(${images.vision})` }}
        >
          <div className="contact-overlay" />
          <div className="contact-ornament left" />
          <div className="contact-ornament right" />
          <div className="container contact-inner reveal">
            <span className="contact-kicker">START A CONVERSATION</span>
            <h2>
              Let&apos;s Build Something
              <br />
              <em>Meaningful</em>
            </h2>
            <p>
              Have a project, partnership, or business opportunity in mind? Connect with Ryan Group.
            </p>
            <div className="contact-actions">
              <a href="/contacts" className="button golden-button">
                Get in Touch <Arrow />
              </a>
              <a href={`tel:${site.phone.tel}`} className="button button-outline">
                Discuss a Project <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
      </main>

      <PageFooter topId="home" />
    </div>
  );
}

export default App;
