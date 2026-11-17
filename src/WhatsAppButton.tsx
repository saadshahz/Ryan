import { useEffect, useState } from "react";
import { site } from "./siteConfig";
import { MessageCircle } from "lucide-react";

/** Set the number in src/siteConfig.ts (`whatsappNumber`). While it is null, the button
 * links to the Contact page enquiry form instead of WhatsApp. */
export const WHATSAPP_NUMBER = site.whatsappNumber;

export const WHATSAPP_MESSAGE =
  "Hello Ryan Group, I would like to know more about your projects and services.";

const isValidNumber = (value: string | null): value is string =>
  value !== null && /^\d{8,15}$/.test(value);

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="wa-icon">
      <path
        fill="currentColor"
        d="M12.04 2.5A9.43 9.43 0 0 0 3.9 16.7L2.5 21.5l4.93-1.39A9.43 9.43 0 1 0 12.04 2.5Zm0 17.2c-1.48 0-2.93-.4-4.19-1.16l-.3-.18-2.93.83.84-2.85-.2-.31a7.74 7.74 0 1 1 6.78 3.67Zm4.24-5.79c-.23-.12-1.38-.68-1.59-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.33 6.33 0 0 1-1.87-1.16 7 7 0 0 1-1.3-1.61c-.13-.23 0-.36.1-.47.11-.11.24-.27.35-.41.12-.14.16-.23.24-.39.08-.16.04-.29-.02-.41-.06-.12-.53-1.27-.72-1.74-.19-.46-.38-.39-.53-.4h-.45a.86.86 0 0 0-.62.29 2.6 2.6 0 0 0-.81 1.93c0 1.14.83 2.24.94 2.39.12.16 1.63 2.48 3.94 3.48.55.24.98.38 1.31.49.55.17 1.05.15 1.45.09.44-.07 1.38-.56 1.57-1.11.19-.55.19-1.01.14-1.11-.06-.1-.21-.16-.44-.27Z"
      />
    </svg>
  );
}

/** Global floating contact button, mounted once at the app root. */
function WhatsAppButton() {
  const [lifted, setLifted] = useState(false);
  const [peek, setPeek] = useState(false);
  const configured = isValidNumber(WHATSAPP_NUMBER);

  // Move up while the footer's "Back to top" link is on screen so they never overlap.
  useEffect(() => {
    const target = document.querySelector(".back-top");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setLifted(entry.isIntersecting), {
      rootMargin: "0px 0px 40px 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Touch devices have no hover: show the "Contact us" label briefly, once per session.
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    try {
      if (sessionStorage.getItem("rg-contact-peek")) return;
    } catch {
      // Storage unavailable (private mode): still show the hint for this page view.
    }
    // Mark as shown only once it actually appears (safe with StrictMode's double effects).
    const show = window.setTimeout(() => {
      setPeek(true);
      try {
        sessionStorage.setItem("rg-contact-peek", "1");
      } catch {
        // Ignore storage errors.
      }
    }, 1600);
    const hide = window.setTimeout(() => setPeek(false), 5200);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const link = configured
    ? {
        href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
        target: "_blank",
        rel: "noopener noreferrer",
        label: "Chat with Ryan Group on WhatsApp (opens in a new tab)",
      }
    : {
        href: "/contacts#enquiry-form",
        label: "Contact Ryan Group",
      };

  return (
    <div className={`wa-float ${lifted ? "is-lifted" : ""} ${peek ? "is-peek" : ""}`}>
      <a
        className="wa-fab golden-button"
        href={link.href}
        target={link.target}
        rel={link.rel}
        aria-label={link.label}
        data-configured={configured}
      >
        {configured ? <WhatsAppIcon /> : <MessageCircle aria-hidden="true" className="wa-icon" />}
      </a>
      <span className="wa-tip" aria-hidden="true">
        Contact us
      </span>
    </div>
  );
}

export default WhatsAppButton;
