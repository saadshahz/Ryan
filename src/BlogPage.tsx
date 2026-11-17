import { useEffect, useMemo, useRef, useState } from "react";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";
import {
  articles,
  blogPath,
  featuredArticle,
  formatDate,
  readingTime,
  type Article,
} from "./blogData";

const PAGE_SIZE = 8;
const ALL = "all";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const categorySlug = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}

export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <article className="bl-card" style={{ animationDelay: `${Math.min(index, 7) * 60}ms` }}>
      <div className="bl-card-media">
        <img src={article.coverImage.src} alt={article.coverImage.alt} loading="lazy" />
        <span className="bl-badge">{article.category}</span>
      </div>
      <div className="bl-card-body">
        <h3>
          {/* Stretched link: the whole card is clickable, with one link per card for keyboard users. */}
          <a href={blogPath(article.slug)} className="bl-card-link">
            {article.title}
          </a>
        </h3>
        <p>{article.excerpt}</p>
        <div className="bl-card-foot">
          <time dateTime={article.publicationDate}>{formatDate(article.publicationDate)}</time>
          <span className="bl-card-cta" aria-hidden="true">
            Read Article <Arrow />
          </span>
        </div>
      </div>
    </article>
  );
}

function readQuery(categories: string[]) {
  const params = new URLSearchParams(window.location.search);
  const category = params.get("category") ?? ALL;
  const page = Number.parseInt(params.get("page") ?? "1", 10);
  return {
    category: category === ALL || categories.includes(category) ? category : ALL,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function BlogPage() {
  usePageMeta(
    "Ryan Group Blog | Architecture, Construction & Insights",
    "Insights and perspectives from Ryan Group on architecture, construction, real estate and design: ideas behind spaces built for enduring value.",
  );

  const listing = useMemo(() => articles.filter((item) => item.slug !== featuredArticle.slug), []);
  const categories = useMemo(
    () => [...new Set(listing.map((item) => item.category))],
    [listing],
  );
  const categorySlugs = useMemo(() => categories.map(categorySlug), [categories]);

  const [initial] = useState(() => readQuery(categorySlugs));
  const [category, setCategory] = useState(initial.category);
  const [page, setPage] = useState(initial.page);
  const listingRef = useRef<HTMLDivElement>(null);
  const shouldScroll = useRef(false);

  const filtered = useMemo(
    () =>
      category === ALL ? listing : listing.filter((item) => categorySlug(item.category) === category),
    [category, listing],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeLabel =
    category === ALL ? "All Articles" : categories[categorySlugs.indexOf(category)] ?? "All Articles";

  // Keep the URL shareable (?category=…&page=…) without adding history entries.
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== ALL) params.set("category", category);
    if (currentPage > 1) params.set("page", String(currentPage));
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }, [category, currentPage]);

  // After a page change, bring the top of the article grid into view.
  useEffect(() => {
    if (!shouldScroll.current) return;
    shouldScroll.current = false;
    listingRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }, [currentPage]);

  const goToPage = (next: number) => {
    const target = Math.max(1, Math.min(pageCount, next));
    if (target === currentPage) return;
    shouldScroll.current = true;
    setPage(target);
  };

  const chooseCategory = (next: string) => {
    setCategory(next);
    setPage(1);
  };

  const filters = [
    { slug: ALL, label: "All Articles", count: listing.length },
    ...categories.map((label, index) => ({
      slug: categorySlugs[index],
      label,
      count: listing.filter((item) => item.category === label).length,
    })),
  ];

  return (
    <RevealPage>
      <div className="site blog-page">
        <PageHeader active="Blog" solid />
        <main>
          <section id="blog-top" className="bl-top">
            <div className="container">
              <div className="bl-panel">
                <div className="bl-heading reveal">
                  <nav className="bl-breadcrumb" aria-label="Breadcrumb">
                    <a href="/">Home</a>
                    <span aria-hidden="true">/</span>
                    <strong aria-current="page">Blog</strong>
                  </nav>
                  <h1>
                    Insights &amp; <em>Perspectives</em>
                  </h1>
                </div>

                <article className="bl-featured reveal" aria-labelledby="bl-featured-title">
                  <a
                    href={blogPath(featuredArticle.slug)}
                    className="bl-featured-media"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img src={featuredArticle.coverImage.src} alt="" fetchPriority="high" decoding="async" />
                  </a>
                  <div className="bl-featured-copy">
                    <div className="bl-featured-kicker">
                      <span className="bl-kicker-label">Featured</span>
                      <i aria-hidden="true" />
                      <span>{featuredArticle.category}</span>
                    </div>
                    <h2 id="bl-featured-title">
                      <a href={blogPath(featuredArticle.slug)}>{featuredArticle.title}</a>
                    </h2>
                    <p>{featuredArticle.excerpt}</p>
                    <p className="bl-meta">
                      <time dateTime={featuredArticle.publicationDate}>
                        {formatDate(featuredArticle.publicationDate)}
                      </time>
                      <span aria-hidden="true">·</span>
                      {readingTime(featuredArticle)} min read
                    </p>
                    <a
                      href={blogPath(featuredArticle.slug)}
                      className="button golden-button bl-featured-button"
                      aria-label={`Read article: ${featuredArticle.title}`}
                    >
                      Read Article <Arrow />
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section className="bl-listing" aria-labelledby="bl-listing-title">
            <div className="container">
              <div className="bl-listing-head" ref={listingRef}>
                <div className="section-title reveal">
                  <div className="eyebrow">
                    <span />
                    LATEST ARTICLES
                  </div>
                  <h2 id="bl-listing-title">
                    From the <em>Journal</em>
                  </h2>
                </div>
                <div
                  className="bl-filters reveal"
                  role="group"
                  aria-label="Filter articles by category"
                >
                  {filters.map((filter) => (
                    <button
                      key={filter.slug}
                      type="button"
                      className={filter.slug === category ? "is-active" : undefined}
                      aria-pressed={filter.slug === category}
                      onClick={() => chooseCategory(filter.slug)}
                    >
                      {filter.label}
                      <span className="bl-filter-count" aria-hidden="true">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="sr-only" aria-live="polite">
                {filtered.length === 0
                  ? `No articles in ${activeLabel}.`
                  : `Showing ${activeLabel}, page ${currentPage} of ${pageCount}.`}
              </p>

              {visible.length > 0 ? (
                <div className="bl-grid" key={`${category}-${currentPage}`}>
                  {visible.map((item, index) => (
                    <ArticleCard key={item.slug} article={item} index={index} />
                  ))}
                </div>
              ) : (
                <div className="bl-empty">
                  <span aria-hidden="true" />
                  <h3>No articles in this category yet.</h3>
                  <p>New insights are added regularly. Explore the full journal in the meantime.</p>
                  <button type="button" className="pd-line-button" onClick={() => chooseCategory(ALL)}>
                    View All Articles <Arrow />
                  </button>
                </div>
              )}

              {pageCount > 1 && (
                <nav className="bl-pagination" aria-label="Article pages">
                  <button
                    type="button"
                    className="bl-page-step"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="bl-page-arrow" aria-hidden="true">
                      ←
                    </span>
                    Previous
                  </button>
                  <ol>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                      <li key={number}>
                        <button
                          type="button"
                          className={number === currentPage ? "is-active" : undefined}
                          aria-current={number === currentPage ? "page" : undefined}
                          aria-label={`Page ${number}`}
                          onClick={() => goToPage(number)}
                        >
                          {String(number).padStart(2, "0")}
                        </button>
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    className="bl-page-step"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pageCount}
                  >
                    Next
                    <span className="bl-page-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </nav>
              )}

              <p className="bl-note">
                Articles shown are illustrative presentation content, not published Ryan Group
                writing.
              </p>
            </div>
          </section>

          <BlogClosingCta />
        </main>
        <PageFooter topId="blog-top" />
      </div>
    </RevealPage>
  );
}

export function BlogClosingCta() {
  return (
    <section className="bl-cta" aria-labelledby="bl-cta-title">
      <div className="container bl-cta-inner reveal">
        <span className="bl-cta-eyebrow">
          <i aria-hidden="true" />
          LET&apos;S BUILD SOMETHING MEANINGFUL
          <i aria-hidden="true" />
        </span>
        <h2 id="bl-cta-title">
          Have a Project <em>in Mind?</em>
        </h2>
        <p>Explore how Ryan Group can bring your next development vision to life.</p>
        <div className="bl-cta-actions">
          <a href="/contacts#enquiry-form" className="button golden-button">
            Contact Ryan Group <Arrow />
          </a>
          <a href="/projects" className="button button-outline">
            Explore Our Projects
          </a>
        </div>
      </div>
    </section>
  );
}

export default BlogPage;
