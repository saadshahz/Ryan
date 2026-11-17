import { useEffect, useState } from "react";
import { fitWidth } from "./responsiveImage";
import { PageHeader } from "./PageChrome";

const constructionImages = {
  hero: fitWidth("https://images.unsplash.com/photo-1569169513673-2cecbfc943a9?auto=format&fit=crop&w=2200&q=90"),
  introduction:
    "https://images.unsplash.com/photo-1770756248866-00b8b7c1dd75?auto=format&fit=crop&w=1300&q=88",
  residential:
    "https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=1100&q=86",
  commercial:
    "https://images.unsplash.com/photo-1573918644828-9598c67e680c?auto=format&fit=crop&w=1100&q=86",
  planning:
    "https://images.unsplash.com/photo-1760296404241-2d60056d401f?auto=format&fit=crop&w=1100&q=86",
  projectOne:
    "https://images.unsplash.com/photo-1757356657991-c3fd6e2e812e?auto=format&fit=crop&w=1500&q=88",
  projectTwo:
    "https://images.unsplash.com/photo-1614595737683-1740e41bfaac?auto=format&fit=crop&w=1200&q=88",
  quality:
    "https://images.unsplash.com/photo-1496236436299-cde70e3587cf?auto=format&fit=crop&w=1300&q=88",
  closing:
    fitWidth("https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=2200&q=90"),
};

const constructionNav = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Projects", "/projects"],
  ["Blog", "/blog"],
  ["Contacts", "/contacts"],
];

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

function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="/" className={`logo ${dark ? "logo-dark" : ""}`} aria-label="Ryan Group home">
      <span className="logo-mark">
        <span>R</span>
        <i />
      </span>
      <span className="logo-copy">
        <strong>RYAN</strong>
        <small>GROUP</small>
      </span>
    </a>
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
    <div className={`section-title reveal ${centered ? "centered" : ""} ${light ? "light" : ""}`}>
      <div className="eyebrow">
        <span />
        {eyebrow}
      </div>
      <h2>{children}</h2>
    </div>
  );
}

function ConstructionPage() {

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Ryan Group Construction | Building with Purpose";

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="site construction-page">
      <PageHeader active="" />

      <main>
        <section
          id="construction-top"
          className="construction-hero"
          style={{ backgroundImage: `url(${constructionImages.hero})` }}
        >
          <div className="construction-hero-overlay" />
          <div className="container construction-hero-content">
            <div className="breadcrumb">
              <a href="/">Home</a>
              <span>/</span>
              <strong>Construction</strong>
            </div>
            <div className="hero-eyebrow">
              RYAN GROUP <span /> CONSTRUCTION
            </div>
            <h1>
              Building with Purpose.
              <br />
              <em>Delivering with Precision.</em>
            </h1>
            <p>
              We bring ideas to life through thoughtful planning, quality craftsmanship, and a
              commitment to enduring structures.
            </p>
            <div className="hero-actions">
              <a href="#construction-projects" className="button golden-button">
                Explore Our Projects <Arrow />
              </a>
              <a href="#construction-contact" className="button button-ghost">
                Discuss a Project <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="construction-hero-side">
            <span>BUILT WITH INTENT</span>
            <i />
          </div>
        </section>

        <section className="section construction-intro">
          <div className="container construction-intro-grid">
            <div className="construction-intro-visual reveal">
              <div className="construction-intro-image">
                <img loading="lazy" decoding="async"
                  src={constructionImages.introduction}
                  alt="Building under construction with a tower crane"
                />
              </div>
              <span className="construction-image-index">01 / FOUNDATION</span>
            </div>
            <div className="construction-intro-copy">
              <Heading eyebrow="OUR EXPERTISE">
                A Strong Foundation
                <br />
                for Every <em>Vision</em>
              </Heading>
              <p className="construction-intro-lead reveal">
                At Ryan Group, construction is more than creating structures. It is about bringing
                ideas to life through thoughtful planning, quality craftsmanship, and a commitment
                to lasting value.
              </p>
              <p className="body-copy reveal">
                Our approach focuses on understanding each project&apos;s purpose, maintaining
                attention to detail, and delivering built environments that reflect our vision of
                excellence.
              </p>
              <blockquote className="construction-quote reveal">
                “Quality is not an added feature. It is the foundation of everything we build.”
              </blockquote>
              <a href="/about" className="text-link reveal">
                About Ryan Group <Arrow />
              </a>
            </div>
          </div>
        </section>

        <section className="section capabilities-section">
          <div className="container">
            <div className="capabilities-heading">
              <Heading eyebrow="WHAT WE DO">
                Our Construction <em>Capabilities</em>
              </Heading>
              <p className="reveal">
                Explore the areas of construction that shape our approach to building and
                development.
              </p>
            </div>
            <div className="capabilities-grid">
              {[
                [
                  "Residential Construction",
                  constructionImages.residential,
                  "Creating thoughtfully planned residential spaces with an emphasis on functionality, quality, and enduring design.",
                ],
                [
                  "Commercial Construction",
                  constructionImages.commercial,
                  "Developing professional environments designed to support business needs and long-term value.",
                ],
                [
                  "Project Planning & Execution",
                  constructionImages.planning,
                  "Bringing projects from concept to completion through structured planning and coordinated execution.",
                ],
              ].map(([title, image, copy], index) => (
                <article className="capability-card reveal" key={title}>
                  <div className="capability-image">
                    <img loading="lazy" decoding="async" src={image} alt={`${title} architectural example`} />
                    <span>0{index + 1}</span>
                  </div>
                  <div className="capability-copy">
                    <div className="capability-rule" />
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    <a href="#construction-contact" aria-label={`Discuss ${title}`}>
                      Discuss Capability <Arrow diagonal />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section construction-process">
          <div className="process-blueprint" />
          <div className="container">
            <div className="process-heading">
              <Heading eyebrow="OUR APPROACH" light>
                From Vision to <em>Reality</em>
              </Heading>
              <p className="reveal">
                Every successful project begins with a clear vision and a thoughtful process.
              </p>
            </div>
            <div className="process-timeline">
              {[
                [
                  "Consultation & Planning",
                  "Understanding project objectives, requirements, and possibilities.",
                ],
                [
                  "Design & Preparation",
                  "Developing a clear project direction and preparing for execution.",
                ],
                [
                  "Construction & Execution",
                  "Bringing the project to life through coordinated construction activities.",
                ],
                [
                  "Completion & Handover",
                  "Finalizing the project and preparing the completed space for its next chapter.",
                ],
              ].map(([title, copy], index) => (
                <article className="process-step reveal" key={title}>
                  <div className="process-marker">
                    <span>0{index + 1}</span>
                    <i />
                  </div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="construction-projects" className="section construction-projects">
          <div className="container">
            <div className="construction-projects-heading">
              <Heading eyebrow="SELECTED WORK">
                Built to Make a
                <br />
                Lasting <em>Impression</em>
              </Heading>
              <div className="reveal">
                <p>
                  Explore a selection of projects that represent our commitment to construction and
                  thoughtful development.
                </p>
                <a href="/projects" className="text-link">
                  View All Projects <Arrow />
                </a>
              </div>
            </div>
            <div className="construction-project-grid">
              {[
                ["Ryan Heights", "Residential Construction", constructionImages.projectOne, "01"],
                [
                  "Ryan Grand Residency",
                  "Residential Development",
                  constructionImages.projectTwo,
                  "02",
                ],
              ].map(([title, category, image, number], index) => (
                <article
                  className={`construction-project reveal ${index === 0 ? "featured" : ""}`}
                  key={title}
                >
                  <a href="/projects" className="construction-project-image">
                    <img loading="lazy" decoding="async" src={image} alt={`${title} residential architecture`} />
                    <span className="project-status">Completed</span>
                    <span className="construction-project-arrow">
                      <Arrow diagonal />
                    </span>
                  </a>
                  <div className="construction-project-info">
                    <span>{number}</span>
                    <div>
                      <p>{category} · Dummy Location</p>
                      <h3>{title}</h3>
                    </div>
                    <a href="/projects">
                      View Project <Arrow />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section quality-section">
          <div className="container quality-grid">
            <div className="quality-visual reveal">
              <img loading="lazy" decoding="async"
                src={constructionImages.quality}
                alt="Close architectural detail showing concrete material craftsmanship"
              />
              <div className="quality-stamp">
                <span>BUILT</span>
                <strong>with</strong>
                <span>INTENT</span>
              </div>
            </div>
            <div className="quality-copy">
              <Heading eyebrow="OUR COMMITMENT">
                Built on Standards.
                <br />
                Driven by <em>Commitment.</em>
              </Heading>
              <p className="quality-lead reveal">
                We believe enduring structures are created through thoughtful decisions, attention
                to detail, and a commitment to quality throughout the construction journey.
              </p>
              <div className="quality-principles">
                {[
                  "Quality Materials",
                  "Thoughtful Planning",
                  "Attention to Detail",
                  "Lasting Value",
                ].map((principle, index) => (
                  <div className="quality-principle reveal" key={principle}>
                    <span>0{index + 1}</span>
                    <i />
                    <strong>{principle}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="construction-contact"
          className="construction-closing"
          style={{ backgroundImage: `url(${constructionImages.closing})` }}
        >
          <div className="construction-closing-overlay" />
          <div className="container construction-closing-content reveal">
            <span className="contact-kicker">START A CONVERSATION</span>
            <h2>
              Have a Vision
              <br />
              <em>Worth Building?</em>
            </h2>
            <p>Let&apos;s explore how Ryan Group can bring your next project to life.</p>
            <div className="contact-actions">
              <a href="mailto:hello@ryangroup.example" className="button golden-button">
                Discuss Your Project <Arrow />
              </a>
              <a href="/contacts" className="button button-outline">
                Contact Us <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Building enduring spaces through integrity, thoughtful design, and uncompromising
              quality.
            </p>
            <div className="socials">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                ig
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Quick Links</h3>
            {constructionNav.slice(0, 5).map(([label, href]) => (
              <a key={label} href={href}>
                {label}
              </a>
            ))}
          </div>
          <div className="footer-column">
            <h3>Our Businesses</h3>
            <a href="/construction">Construction</a>
            <a href="/about#business-verticals">
              PG Accommodation <small>Soon</small>
            </a>
            <a href="/about#business-verticals">
              Real Estate <small>Soon</small>
            </a>
          </div>
          <div className="footer-column contact-details">
            <h3>Get in Touch</h3>
            <a href="mailto:hello@ryangroup.example">hello@ryangroup.example</a>
            <a href="tel:+919800000000">+91 98000 00000</a>
            <p>
              Ryan House, Business District,
              <br />
              Mumbai, India 400001
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>© 2025 Ryan Group. All rights reserved.</p>
          <div>
            <span>Privacy Policy</span>
            <span>Terms</span>
          </div>
          <a href="#construction-top" className="back-top">
            Back to top <span>↑</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ConstructionPage;
