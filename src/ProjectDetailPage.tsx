import { useEffect, useRef, useState } from "react";
import { fitWidth } from "./responsiveImage";
import {
  Building2,
  Check,
  Gem,
  Info,
  LayoutPanelLeft,
  Leaf,
  MapPin,
  Navigation,
  PenTool,
  Ruler,
  Share2,
  ShieldCheck,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";
import ProjectGallery from "./ProjectGallery";
import FeaturedProjectsCarousel from "./FeaturedProjectsCarousel";
import { findProject, projectPath, type FeatureIcon, type Project } from "./projectData";

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  architecture: Building2,
  planning: Ruler,
  quality: ShieldCheck,
  layout: LayoutPanelLeft,
  design: PenTool,
  detail: Gem,
  living: Sofa,
  sustainable: Leaf,
};

const closingImage =
  fitWidth("https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=2200&q=88");

/** "Ryan Grand Residency" -> ["Ryan Grand", "Residency"], so the last word gets the gold accent. */
function splitName(name: string) {
  const words = name.split(" ");
  return words.length > 1 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : ["", name];
}

function ShareButton({ project }: { project: Project }) {
  const [message, setMessage] = useState("");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 4000);
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${project.name} | Ryan Group`, text: project.summary, url });
        return;
      } catch (error) {
        // The visitor closed the share sheet: nothing to report.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Project link copied to clipboard.");
    } catch {
      flash(`Copy this link: ${url}`);
    }
  };

  return (
    <div className="pd-share">
      <button type="button" className="pd-line-button" onClick={share}>
        <Share2 aria-hidden="true" /> Share Project
      </button>
      <span className={`pd-share-note ${message ? "is-visible" : ""}`} role="status">
        {message && (
          <>
            <Check aria-hidden="true" /> {message}
          </>
        )}
      </span>
    </div>
  );
}

function FaqAccordion({ project }: { project: Project }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });

  return (
    <div className="pd-faq-list reveal">
      {project.faqs.map((faq, index) => {
        const isOpen = open.has(index);
        const id = `pd-faq-${index}`;
        return (
          <div className={`pd-faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
            <h3>
              <button
                type="button"
                id={`${id}-button`}
                aria-expanded={isOpen}
                aria-controls={`${id}-panel`}
                onClick={() => toggle(index)}
              >
                <span className="pd-faq-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="pd-faq-question">{faq.question}</span>
                <span className="pd-faq-icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={`${id}-panel`}
              className="pd-faq-panel"
              role="region"
              aria-labelledby={`${id}-button`}
              inert={!isOpen}
            >
              <div>
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MapPreview({ project }: { project: Project }) {
  return (
    <div className="pd-map reveal" role="img" aria-label="Illustrative location preview. Not an actual map.">
      <svg className="pd-map-art" viewBox="0 0 600 440" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g className="pd-map-blocks">
          <rect x="30" y="30" width="150" height="95" rx="6" />
          <rect x="205" y="30" width="120" height="95" rx="6" />
          <rect x="350" y="30" width="220" height="60" rx="6" />
          <rect x="30" y="150" width="95" height="120" rx="6" />
          <rect x="150" y="150" width="175" height="120" rx="6" />
          <rect x="430" y="115" width="140" height="155" rx="6" />
          <rect x="30" y="295" width="200" height="115" rx="6" />
          <rect x="255" y="295" width="150" height="115" rx="6" />
          <rect x="430" y="295" width="140" height="115" rx="6" />
        </g>
        <rect className="pd-map-park" x="350" y="115" width="58" height="155" rx="6" />
        <path className="pd-map-water" d="M-20 380 C 120 330, 220 430, 360 372 S 560 300, 640 340" />
        <g className="pd-map-roads">
          <path d="M0 138 H600" />
          <path d="M0 283 H600" />
          <path d="M192 0 V440" />
          <path d="M418 0 V440" />
          <path d="M0 40 L600 420" className="minor" />
        </g>
      </svg>
      <span className="pd-map-label">
        <Info aria-hidden="true" /> Location Preview
      </span>
      <span className="pd-map-pin">
        <span className="pd-map-pulse" />
        <MapPin aria-hidden="true" />
      </span>
      <span className="pd-map-tag">
        <strong>{project.name}</strong>
        <small>{project.location}</small>
      </span>
      <span className="pd-map-note">Illustrative only · Not to scale</span>
    </div>
  );
}

function NotFound({ slug }: { slug: string }) {
  useEffect(() => {
    document.title = "Project Not Found | Ryan Group";
  }, []);
  return (
    <RevealPage>
      <div className="site">
        <PageHeader active="Projects" solid />
        <main>
          <section id="project-top" className="section pd-missing">
            <div className="container">
              <div className="eyebrow">
                <span />
                PROJECT NOT FOUND
              </div>
              <h1>
                We couldn&apos;t find <em>that project.</em>
              </h1>
              <p>
                No project matches “{slug}”. It may have moved, or the link may be incomplete.
              </p>
              <a href="/projects" className="button golden-button">
                View All Projects <Arrow />
              </a>
            </div>
          </section>
        </main>
        <PageFooter topId="project-top" />
      </div>
    </RevealPage>
  );
}

export default function ProjectDetailPage({ slug }: { slug: string }) {
  const project = findProject(slug);

  useEffect(() => {
    if (project) document.title = `${project.name} | Ryan Group Projects`;
  }, [project]);

  if (!project) return <NotFound slug={slug} />;

  const [namePrefix, nameAccent] = splitName(project.name);

  return (
    <RevealPage>
      <div className="site project-detail-page">
        <PageHeader active="Projects" />
        <main>
          <section
            id="project-top"
            className="portfolio-hero pd-hero"
            style={{ backgroundImage: `url(${project.heroImage})` }}
          >
            <div className="portfolio-hero-overlay" />
            <div className="container portfolio-hero-content">
              <div className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/projects">Projects</a>
                <span>/</span>
                <strong>{project.name}</strong>
              </div>
              <div className="hero-eyebrow">
                {project.category.toUpperCase()} <span /> {project.number}
              </div>
              <h1>
                {namePrefix && <>{namePrefix} </>}
                <em>{nameAccent}</em>
              </h1>
              <p>{project.summary}</p>
              <dl className="pd-hero-meta">
                <div>
                  <dt>Project Type</dt>
                  <dd>{project.projectType}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{project.location}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <i aria-hidden="true" /> {project.status}
                  </dd>
                </div>
              </dl>
              <div className="hero-actions">
                <a href="#gallery" className="button golden-button">
                  Explore Project <Arrow />
                </a>
                <a href="/contacts#enquiry-form" className="button button-ghost">
                  Enquire About This Project <Arrow />
                </a>
              </div>
            </div>
            <div className="portfolio-hero-number">{project.number}</div>
          </section>

          <section id="gallery" className="section pd-gallery-section">
            <div className="container">
              <ProjectGallery images={project.galleryImages} title={project.name} />
            </div>
          </section>

          <section id="overview" className="section pd-overview">
            <div className="container pd-overview-grid">
              <div className="pd-overview-copy">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    ABOUT THE PROJECT
                  </div>
                  <h2>
                    Designed with <em>Purpose.</em>
                  </h2>
                </div>
                <p className="pd-overview-lead reveal">{project.description}</p>
                <p className="body-copy reveal">{project.secondaryDescription}</p>
                <div className="reveal">
                  <ShareButton project={project} />
                </div>
              </div>

              <aside className="pd-specs reveal" aria-labelledby="pd-specs-title">
                <div className="pd-specs-head">
                  <h3 id="pd-specs-title">Project Specifications</h3>
                  <span className="pd-placeholder-badge">Placeholder data</span>
                </div>
                <dl>
                  {project.specifications.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="pd-specs-note">
                  Illustrative details for presentation. To be confirmed by Ryan Group.
                </p>
              </aside>
            </div>
          </section>

          <section className="section pd-features">
            <div className="container">
              <div className="pd-features-head">
                <div className="section-title centered reveal">
                  <div className="eyebrow">
                    <span />
                    FEATURES &amp; AMENITIES
                  </div>
                  <h2>
                    Thoughtful Details.
                    <br />
                    <em>Lasting Value.</em>
                  </h2>
                </div>
                <p className="reveal">
                  Explore the features and design considerations that shape the project.
                </p>
              </div>
              <ul className="pd-feature-grid">
                {project.features.map((feature) => {
                  const Icon = featureIcons[feature.icon];
                  return (
                    <li className="pd-feature reveal" key={feature.title}>
                      <span className="pd-feature-icon">
                        <Icon aria-hidden="true" strokeWidth={1.25} />
                      </span>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="pd-features-note reveal">Illustrative features for presentation.</p>
            </div>
          </section>

          <section id="location" className="section pd-location">
            <div className="container pd-location-grid">
              <div className="pd-location-copy">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    LOCATION &amp; CONNECTIVITY
                  </div>
                  <h2>
                    Discover the <em>Neighborhood.</em>
                  </h2>
                </div>
                <p className="body-copy reveal">
                  Explore the location and surroundings of this development.
                </p>
                <dl className="pd-location-list reveal">
                  <div>
                    <dt>Address</dt>
                    <dd>
                      {project.address.lines.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt>Connectivity</dt>
                    <dd>Details to be shared by Ryan Group.</dd>
                  </div>
                </dl>
                <div className="pd-location-action reveal">
                  {project.address.mapsUrl ? (
                    <a
                      href={project.address.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button golden-button"
                    >
                      Get Directions <Navigation aria-hidden="true" className="icon" />
                    </a>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="pd-line-button"
                        disabled
                        aria-describedby="pd-directions-note"
                      >
                        <Navigation aria-hidden="true" /> Get Directions
                      </button>
                      <p id="pd-directions-note">
                        Directions will be available once the project address is confirmed.
                      </p>
                    </>
                  )}
                </div>
              </div>
              <MapPreview project={project} />
            </div>
          </section>

          <section className="section pd-faq">
            <div className="container pd-faq-grid">
              <div className="pd-faq-intro">
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    FAQ
                  </div>
                  <h2>
                    Frequently Asked <em>Questions</em>
                  </h2>
                </div>
                <p className="body-copy reveal">Learn more about the project.</p>
                <a href="/contacts#enquiry-form" className="text-link reveal">
                  Ask Our Team <Arrow />
                </a>
              </div>
              <FaqAccordion project={project} />
            </div>
          </section>

          <section id="projects" className="section projects-section">
            <div className="container">
              <FeaturedProjectsCarousel eyebrow="OUR WORK" initialSlug={project.slug} />
            </div>
          </section>

          <section
            className="portfolio-closing pd-closing"
            style={{ backgroundImage: `url(${closingImage})` }}
          >
            <div className="portfolio-closing-overlay" />
            <div className="container portfolio-closing-content reveal">
              <span className="contact-kicker">START A CONVERSATION</span>
              <h2>
                Have a Vision of
                <br />
                Your <em>Own?</em>
              </h2>
              <p>Let&apos;s discuss how Ryan Group can bring your next project to life.</p>
              <div className="contact-actions">
                <a href="/contacts#enquiry-form" className="button golden-button">
                  Discuss Your Project <Arrow />
                </a>
                <a href="/contacts" className="button button-outline">
                  Contact Ryan Group <Arrow diagonal />
                </a>
              </div>
            </div>
          </section>
        </main>
        <PageFooter topId="project-top" />
      </div>
    </RevealPage>
  );
}
