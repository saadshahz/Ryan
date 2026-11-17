import { useEffect } from "react";
import { Arrow, PageFooter, PageHeader, RevealPage } from "./PageChrome";

/** Shown for any URL that does not match a route (the host serves index.html for all paths). */
function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found | Ryan Group";
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex";
  }, []);

  return (
    <RevealPage>
      <div className="site">
        <PageHeader active="" solid />
        <main>
          <section id="not-found-top" className="section pd-missing">
            <div className="container">
              <div className="eyebrow">
                <span />
                PAGE NOT FOUND
              </div>
              <h1>
                We couldn&apos;t find <em>that page.</em>
              </h1>
              <p>The page you are looking for may have moved, or the link may be incomplete.</p>
              <div className="not-found-actions">
                <a href="/" className="button golden-button">
                  Back to Home <Arrow />
                </a>
                <a href="/contacts" className="pd-line-button">
                  Contact Ryan Group
                </a>
              </div>
            </div>
          </section>
        </main>
        <PageFooter topId="not-found-top" />
      </div>
    </RevealPage>
  );
}

export default NotFoundPage;
