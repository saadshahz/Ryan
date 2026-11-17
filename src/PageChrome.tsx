import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";

const navigation = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Projects", "/projects"],
  ["Blog", "/blog"],
  ["Contacts", "/contacts"],
];

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
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

export function Logo({ dark = false }: { dark?: boolean }) {
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

/** Width at which the full desktop navigation replaces the hamburger menu (keep in sync with CSS). */
const DESKTOP_NAV_QUERY = "(min-width: 1024px)";

export function PageHeader({ active, solid = false }: { active: string; solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile menu is open: lock page scrolling, close on Escape or when the
  // viewport grows to desktop width, and move focus into the menu.
  useEffect(() => {
    if (!menuOpen) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia(DESKTOP_NAV_QUERY);
    const onViewportChange = () => desktop.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [menuOpen]);

  // Keep Tab / Shift+Tab inside the header while the menu is open.
  const trapFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (!menuOpen || event.key !== "Tab" || !headerRef.current) return;
    const items = [...headerRef.current.querySelectorAll<HTMLElement>("a[href], button")].filter(
      (element) => element.offsetParent !== null && !element.closest("[inert]"),
    );
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const isSolid = solid || scrolled || menuOpen;

  return (
    <header
      ref={headerRef}
      className={`header ${isSolid ? "header-solid" : ""} ${menuOpen ? "menu-is-open" : ""}`}
      onKeyDown={trapFocus}
    >
      <div className="header-inner">
        <Logo dark={isSolid} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={label === active ? "active-nav" : undefined}
              aria-current={label === active ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="/contacts#enquiry-form" className="header-cta golden-button">
          Enquire Now <Arrow diagonal />
        </a>
        <button
          ref={toggleRef}
          type="button"
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <span />
          <span />
        </button>
      </div>
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        inert={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          {navigation.map(([label, href], index) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={label === active ? "is-current" : undefined}
              aria-current={label === active ? "page" : undefined}
            >
              <span>0{index + 1}</span>
              {label}
            </a>
          ))}
          <a
            className="mobile-connect golden-button"
            href="/contacts#enquiry-form"
            onClick={() => setMenuOpen(false)}
          >
            Enquire Now <Arrow />
          </a>
        </nav>
      </div>
    </header>
  );
}

export function PageFooter({ topId }: { topId: string }) {
  return (
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
          {navigation.map(([label, href]) => (
            <a key={href} href={href}>
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
        <a href={`#${topId}`} className="back-top">
          Back to top <span>↑</span>
        </a>
      </div>
    </footer>
  );
}

export function RevealPage({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in-view")),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return children;
}
