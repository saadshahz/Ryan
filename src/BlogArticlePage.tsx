import { Fragment, useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, Check, Link2 } from "lucide-react";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";
import { ArticleCard, usePageMeta } from "./BlogPage";
import {
  articles,
  findArticle,
  formatDate,
  readingTime,
  type Article,
  type ArticleBlock,
} from "./blogData";

/* ----------------------------------------------------------------------------------------- */
/* Helpers                                                                                    */
/* ----------------------------------------------------------------------------------------- */

function relatedArticles(current: Article, count = 3) {
  const others = articles.filter((item) => item.slug !== current.slug);
  const sameCategory = others.filter((item) => item.category === current.category);
  const rest = others.filter((item) => item.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

/** Renders **bold** and *italic* inline markup as React elements (no raw HTML). */
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return <em key={index}>{part.slice(1, -1)}</em>;
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="bd-lead reveal">
          <RichText text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="reveal">
          <RichText text={block.text} />
        </p>
      );
    case "h2":
      return <h2 className="reveal">{block.text}</h2>;
    case "h3":
      return <h3 className="reveal">{block.text}</h3>;
    case "ul":
    case "ol": {
      const List = block.type;
      return (
        <List className="bd-list reveal">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "figure":
      return (
        <figure className="bd-figure reveal">
          <div className="bd-figure-media">
            <img src={block.src} alt={block.alt} loading="lazy" />
          </div>
          <figcaption>{block.caption}</figcaption>
        </figure>
      );
    case "quote":
      return (
        <figure className="bd-quote reveal">
          <blockquote>
            <p>
              <RichText text={block.text} />
            </p>
          </blockquote>
          {block.cite && <figcaption>{block.cite}</figcaption>}
        </figure>
      );
    case "callout":
      return (
        <aside className="bd-callout reveal" aria-label={block.title}>
          <span>{block.title}</span>
          <p>
            <RichText text={block.text} />
          </p>
        </aside>
      );
  }
}

/* ----------------------------------------------------------------------------------------- */
/* Reading progress                                                                           */
/* ----------------------------------------------------------------------------------------- */

function ReadingProgress({ target }: { target: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const element = target.current;
      const bar = barRef.current;
      if (!element || !bar) return;
      const rect = element.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const read = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - rect.top) / Math.max(total, 1)));
      bar.style.transform = `scaleX(${read})`;
      bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(read * 100)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div
      className="bd-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div ref={barRef} className="bd-progress-bar" />
    </div>
  );
}

/* ----------------------------------------------------------------------------------------- */
/* Sharing                                                                                    */
/* ----------------------------------------------------------------------------------------- */

function BrandIcon({ name }: { name: "linkedin" | "facebook" | "whatsapp" }) {
  const paths = {
    linkedin:
      "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.8v1.6h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-4.94c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.29-1.9 2.62V21h-4V9.75Z",
    facebook:
      "M13.5 21v-7.5h2.53l.38-2.94H13.5V8.68c0-.85.24-1.43 1.46-1.43h1.56V4.62a20.9 20.9 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.16H7.92v2.94h2.54V21h3.04Z",
    whatsapp:
      "M12.04 3a8.9 8.9 0 0 0-7.67 13.42L3 21l4.7-1.33A8.9 8.9 0 1 0 12.04 3Zm0 16.2c-1.4 0-2.77-.38-3.96-1.1l-.28-.17-2.79.79.8-2.71-.19-.29a7.3 7.3 0 1 1 6.42 3.48Zm4-5.46c-.22-.11-1.3-.64-1.5-.72-.2-.07-.35-.11-.5.11-.14.22-.57.72-.7.87-.13.15-.26.17-.48.06a6 6 0 0 1-1.77-1.1 6.6 6.6 0 0 1-1.22-1.52c-.13-.22 0-.34.1-.45l.33-.39c.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.05-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38h-.42a.8.8 0 0 0-.58.27 2.4 2.4 0 0 0-.76 1.8c0 1.07.78 2.1.89 2.24.11.15 1.53 2.34 3.71 3.28.52.22.92.36 1.24.46.52.16 1 .14 1.37.08.42-.06 1.3-.53 1.48-1.04.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.42-.26Z",
  };
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="bd-brand-icon">
      <path d={paths[name]} fill="currentColor" />
    </svg>
  );
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy approach (e.g. insecure context or denied permission).
  }
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  field.remove();
  return ok;
}

function ShareBar({ article }: { article: Article }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const url = `${window.location.origin}${window.location.pathname}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${article.title} | Ryan Group`);

  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 2800);
    return () => window.clearTimeout(timer);
  }, [status]);

  const links = [
    {
      name: "linkedin" as const,
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "facebook" as const,
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "whatsapp" as const,
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
  ];

  return (
    <div className="bd-share">
      <span className="bd-share-label">Share this article</span>
      <div className="bd-share-actions">
        <button
          type="button"
          className={`bd-share-copy ${status === "copied" ? "is-copied" : ""}`}
          onClick={async () => setStatus((await copyText(url)) ? "copied" : "failed")}
        >
          {status === "copied" ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
          {status === "copied" ? "Link Copied" : "Copy Link"}
        </button>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bd-share-icon"
            aria-label={`Share on ${link.label} (opens in a new tab)`}
            title={`Share on ${link.label}`}
          >
            <BrandIcon name={link.name} />
          </a>
        ))}
      </div>
      <p className="bd-share-status" role="status" aria-live="polite">
        {status === "copied" && "Article link copied to clipboard."}
        {status === "failed" && (
          <>
            Couldn&apos;t copy automatically. Copy this link: <span>{url}</span>
          </>
        )}
      </p>
    </div>
  );
}

/* ----------------------------------------------------------------------------------------- */
/* Pages                                                                                      */
/* ----------------------------------------------------------------------------------------- */

function ArticleNotFound({ slug }: { slug: string }) {
  return (
    <RevealPage>
      <div className="site blog-page">
        <PageHeader active="Blog" solid />
        <main>
          <section id="blog-top" className="bl-article-hero bl-missing">
            <div className="container bl-article-narrow">
              <span className="bl-kicker-label">Article not found</span>
              <h1>We couldn&apos;t find that article.</h1>
              <p>
                There is no article at <code>/blog/{slug}</code>. It may have been moved or the
                link may be incorrect.
              </p>
              <a href="/blog" className="button golden-button">
                Back to the Blog <Arrow />
              </a>
            </div>
          </section>
        </main>
        <PageFooter topId="blog-top" />
      </div>
    </RevealPage>
  );
}

function HeroImage({ article }: { article: Article }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`bd-hero-media ${loaded ? "is-loaded" : ""}`}>
      <img
        ref={(element) => {
          if (element?.complete && element.naturalWidth > 0) setLoaded(true);
        }}
        src={article.heroImage}
        alt={article.coverImage.alt}
        fetchPriority="high"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function ArticleView({ article }: { article: Article }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const related = relatedArticles(article);
  const minutes = readingTime(article);

  return (
    <RevealPage>
      <div className="site blog-page bd-page">
        <PageHeader active="Blog" solid />
        <ReadingProgress target={bodyRef} />
        <main>
          <article aria-labelledby="bd-title">
            <header id="blog-top" className="bd-hero">
              <HeroImage article={article} />
              <div className="container bd-title-wrap">
                <div className="bd-title-card">
                  <nav className="bl-breadcrumb bd-breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span aria-hidden="true">/</span>
                    <a href="/blog">Blog</a>
                    <span aria-hidden="true">/</span>
                    <strong aria-current="page">{article.category}</strong>
                  </nav>
                  <span className="bd-category">{article.category}</span>
                  <h1 id="bd-title">{article.title}</h1>
                  <div className="bd-meta">
                    <span className="bd-avatar" aria-hidden="true">
                      RG
                    </span>
                    <span className="bd-author">
                      <span className="sr-only">Written by </span>
                      {article.author}
                    </span>
                    <i aria-hidden="true" />
                    <time dateTime={article.publicationDate}>
                      {formatDate(article.publicationDate)}
                    </time>
                    <i aria-hidden="true" />
                    <span>{minutes} min read</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="bd-body" ref={bodyRef}>
              <div className="bd-content">
                {article.content.map((block, index) => (
                  <Block key={index} block={block} />
                ))}
              </div>

              <div className="bd-article-foot">
                <ShareBar article={article} />
                <div className="bd-foot-row">
                  <a href="/blog" className="bd-back-link">
                    <ArrowLeft aria-hidden="true" /> Back to Blog
                  </a>
                  <p>Illustrative presentation content, not published Ryan Group writing.</p>
                </div>
              </div>
            </div>
          </article>

          {related.length > 0 && (
            <section className="bd-related" aria-labelledby="bd-related-title">
              <div className="container">
                <div className="bd-related-head">
                  <div className="section-title reveal">
                    <div className="eyebrow">
                      <span />
                      FROM THE JOURNAL
                    </div>
                    <h2 id="bd-related-title">
                      Continue <em>Exploring</em>
                    </h2>
                  </div>
                  <div className="bd-related-intro reveal">
                    <p>More perspectives on architecture, construction, and thoughtful development.</p>
                    <a href="/blog" className="text-link">
                      View All Articles <Arrow />
                    </a>
                  </div>
                </div>
                <div className="bl-grid bl-grid-related">
                  {related.map((item, index) => (
                    <ArticleCard key={item.slug} article={item} index={index} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <PageFooter topId="blog-top" />
      </div>
    </RevealPage>
  );
}

function BlogArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug);
  usePageMeta(
    article ? `${article.title} | Ryan Group Blog` : "Article Not Found | Ryan Group Blog",
    article?.excerpt ?? "The article you are looking for could not be found on the Ryan Group blog.",
  );

  return article ? <ArticleView article={article} /> : <ArticleNotFound slug={slug} />;
}

export default BlogArticlePage;
