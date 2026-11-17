import { useEffect, useState } from "react";
import { fitWidth } from "./responsiveImage";
import { PageHeader } from "./PageChrome";
import FeaturedProjectsCarousel from "./FeaturedProjectsCarousel";

const portfolioImages = {
  hero: fitWidth("https://images.unsplash.com/photo-1758193431355-54df41421657?auto=format&fit=crop&w=2200&q=90"),
  philosophy:
    "https://images.unsplash.com/photo-1736774011107-fe132f73ddc1?auto=format&fit=crop&w=1300&q=88",
  closing:
    fitWidth("https://images.unsplash.com/photo-1757359056339-22968344cce6?auto=format&fit=crop&w=2200&q=90"),
};

const projectsNav = [
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
    <a
      href="/"
      className={`logo ${dark ? "logo-dark" : ""}`}
      aria-label="Ryan Group home"
    >
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
          <div className="portfolio-hero-number">02</div>
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
              meaningful. Explore Ryan Group&apos;s portfolio of completed
              buildings, reflecting our commitment to thoughtful construction,
              quality, and lasting value.
            </p>
          </div>
        </section>

        <section id="our-projects" className="section portfolio-showcase">
          <div className="container">
            <FeaturedProjectsCarousel
              eyebrow="COMPLETED PROJECTS"
              title={
                <>
                  A Portfolio Built
                  <br />
                  with <em>Purpose</em>
                </>
              }
              intro="Two completed buildings. One enduring approach to quality, thoughtfulness, and value."
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
                ["02", "Completed Projects"],
                ["02", "Featured Buildings"],
                ["01", "Core Expertise"],
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
                href="mailto:hello@ryangroup.example"
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

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo />
            <p>
              Building enduring spaces through integrity, thoughtful design, and
              uncompromising quality.
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
            {projectsNav.slice(0, 5).map(([label, href]) => (
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
          <a href="#projects-top" className="back-top">
            Back to top <span>↑</span>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default ProjectsPage;
