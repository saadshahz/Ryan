import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Arrow } from "./PageChrome";
import { projectPath, projects as allProjects, type Project } from "./projectData";

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  /** Slug of the project shown first (e.g. the project page currently being viewed). */
  initialSlug?: string;
  /** Shows the "View All Projects" link (hide it on the /projects page itself). */
  showViewAll?: boolean;
  /** Adds an "Enquire About This Project" link to the information panel. */
  showEnquiry?: boolean;
  projects?: Project[];
};

const pad = (value: number) => String(value).padStart(2, "0");

/**
 * Featured projects carousel used on the Homepage, the Projects page and project pages.
 * Built for any number of projects; with exactly two, the inactive project appears as a single
 * side preview and a decorative gold frame balances the opposite side.
 */
function FeaturedProjectsCarousel({
  eyebrow = "OUR PROJECTS",
  title = (
    <>
      Spaces That Stand
      <br />
      as a <em>Legacy</em>
    </>
  ),
  intro = "A glimpse into our projects, designed with thoughtful architecture and a commitment to lasting quality.",
  initialSlug,
  showViewAll = true,
  showEnquiry = false,
  projects = allProjects,
}: Props) {
  const count = projects.length;
  const [active, setActive] = useState(() =>
    Math.max(0, projects.findIndex((project) => project.slug === initialSlug)),
  );
  const [direction, setDirection] = useState<1 | -1>(1);
  const swipe = useRef<{ x: number; id: number } | null>(null);

  if (count === 0) return null;

  const project = projects[active];
  const wrap = (index: number) => (index + count) % count;

  const goTo = (index: number, dir?: 1 | -1) => {
    const target = wrap(index);
    if (target === active) return;
    setDirection(dir ?? (target > active ? 1 : -1));
    setActive(target);
  };
  const next = () => goTo(active + 1, 1);
  const prev = () => goTo(active - 1, -1);

  // Previous project on the left, next on the right. With two projects they are the same
  // project, so show it once: on the right for the first project, on the left for the second.
  const previewLeft = count > 2 || (count === 2 && active === 1) ? projects[wrap(active - 1)] : null;
  const previewRight = count > 2 || (count === 2 && active === 0) ? projects[wrap(active + 1)] : null;

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (count < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  // Touch / pen swipe on the main image (mouse users have arrows, dots and previews).
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    swipe.current = { x: event.clientX, id: event.pointerId };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || start.id !== event.pointerId || count < 2) return;
    const distance = event.clientX - start.x;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) next();
    else prev();
  };

  const mainImage = project.galleryImages[0] ?? project.cardImage;

  const renderPreview = (item: Project, side: "left" | "right") => (
    <button
      type="button"
      key={`${item.slug}-${side}`}
      className={`fpc-preview fpc-preview-${side}`}
      onClick={() => goTo(projects.indexOf(item), side === "left" ? -1 : 1)}
      aria-label={`Show ${item.name}`}
    >
      <img src={item.cardImage.src} alt="" loading="lazy" draggable={false} />
      <span className="fpc-preview-label">
        <small>{item.number}</small>
        {item.name}
      </span>
    </button>
  );

  return (
    <div className="fpc">
      <div className="fpc-head section-title centered reveal">
        <div className="eyebrow">
          <span />
          {eyebrow}
          <span />
        </div>
        <h2>{title}</h2>
        {intro && <p className="fpc-intro">{intro}</p>}
      </div>

      <div
        className="fpc-stage reveal"
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onKeyDown={onKeyDown}
      >
        {count > 1 && (
          <>
            {previewLeft ? (
              renderPreview(previewLeft, "left")
            ) : (
              <span className="fpc-frame fpc-frame-left" aria-hidden="true" />
            )}
            {previewRight ? (
              renderPreview(previewRight, "right")
            ) : (
              <span className="fpc-frame fpc-frame-right" aria-hidden="true" />
            )}
          </>
        )}

        <div
          className="fpc-main"
          role="group"
          aria-roledescription="slide"
          aria-label={`${active + 1} of ${count}: ${project.name}`}
        >
          <div
            className="fpc-media"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            <div
              key={project.slug}
              className={`fpc-media-inner ${direction === 1 ? "from-right" : "from-left"}`}
            >
              <img loading="lazy" decoding="async" src={mainImage.src} alt={mainImage.alt} draggable={false} />
            </div>
            <span className="fpc-badge">Featured Project</span>
          </div>

          <div className="fpc-panel">
            <div key={project.slug} className="fpc-panel-inner">
              <div className="fpc-counter">
                <strong>{project.number}</strong>
                <span>/ {pad(count)}</span>
                <i aria-hidden="true" />
              </div>
              <span className="fpc-category">{project.projectType}</span>
              <h3>{project.name}</h3>
              <p className="fpc-location">
                <MapPin aria-hidden="true" />
                {project.location}
              </p>
              <p className="fpc-summary">{project.summary}</p>
              <div className="fpc-links">
                <a href={projectPath(project.slug)} className="fpc-view">
                  View Project <Arrow />
                </a>
                {showEnquiry && (
                  <a href="/contacts#enquiry-form" className="fpc-enquire">
                    Enquire About This Project
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="fpc-arrow fpc-arrow-prev"
              onClick={prev}
              aria-label="Previous project"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="fpc-arrow fpc-arrow-next"
              onClick={next}
              aria-label="Next project"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        {`Showing project ${active + 1} of ${count}: ${project.name}`}
      </p>

      {count > 1 && (
        <div className="fpc-dots" role="group" aria-label="Choose a project">
          {projects.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              className={index === active ? "is-active" : undefined}
              aria-label={`Show project ${index + 1}: ${item.name}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}

      {showViewAll && (
        <div className="fpc-all">
          <a href="/projects" className="fpc-all-link">
            View All Projects <Arrow />
          </a>
        </div>
      )}
    </div>
  );
}

export default FeaturedProjectsCarousel;
