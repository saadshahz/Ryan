import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import EnquiryForm from "./EnquiryForm";
import { hasEnquiryEngaged, markEnquiryEngaged } from "./enquirySession";

/** Number of separate downward scroll gestures before the popup opens. */
const SCROLL_INTERACTIONS = 3;
/** Wheel events closer together than this belong to one gesture (incl. trackpad momentum). */
const WHEEL_GESTURE_IDLE_MS = 300;
/** After a gesture ends, wait for smooth / momentum scrolling to land before measuring it. */
const SETTLE_MS = 450;
/** A gesture must move the page down at least this far to count. */
const MIN_GESTURE_DISTANCE = 40;
const CLOSE_ANIMATION_MS = 260;

const SCROLL_KEYS = new Set(["ArrowDown", "PageDown", "End", " ", "Spacebar"]);
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Counts the visitor's downward scroll gestures and opens the enquiry popup after the third.
 *
 * A gesture is defined by the visitor's input (a burst of wheel events, one touch swipe or one
 * scroll-key press), and only counts if the *window* actually moved down by at least
 * MIN_GESTURE_DISTANCE. So:
 * - scrolling inside modals, menus or other scrollable elements (the window does not move),
 * - programmatic scrolling (anchor jumps, scroll restoration, no user input),
 * - and upward scrolling
 * are all ignored. The counter lives in memory and resets on every page load.
 */
function useScrollTrigger(enabled: boolean, onTrigger: () => void) {
  useEffect(() => {
    if (!enabled) return;

    let count = 0;
    let finished = false;
    let wheelStartY: number | null = null;
    let wheelTimer = 0;
    let touchStartY: number | null = null;
    let keyStartY: number | null = null;
    const timers = new Set<number>();

    const evaluate = (startY: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (finished || window.scrollY - startY < MIN_GESTURE_DISTANCE) return;
        count += 1;
        if (count >= SCROLL_INTERACTIONS && !hasEnquiryEngaged()) {
          cleanup();
          onTrigger();
        }
      }, SETTLE_MS);
      timers.add(id);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      if (wheelStartY === null) wheelStartY = window.scrollY;
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => {
        const start = wheelStartY;
        wheelStartY = null;
        if (start !== null) evaluate(start);
      }, WHEEL_GESTURE_IDLE_MS);
    };
    const onTouchStart = () => {
      touchStartY = window.scrollY;
    };
    const onTouchEnd = () => {
      if (touchStartY !== null) evaluate(touchStartY);
      touchStartY = null;
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key) && !event.repeat) keyStartY = window.scrollY;
    };
    const onKeyUp = (event: globalThis.KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key) || keyStartY === null) return;
      evaluate(keyStartY);
      keyStartY = null;
    };

    const listeners: [string, EventListener][] = [
      ["wheel", onWheel as EventListener],
      ["touchstart", onTouchStart],
      ["touchend", onTouchEnd],
      ["keydown", onKeyDown as EventListener],
      ["keyup", onKeyUp as EventListener],
    ];
    listeners.forEach(([type, handler]) =>
      window.addEventListener(type, handler, { passive: true }),
    );

    function cleanup() {
      finished = true;
      window.clearTimeout(wheelTimer);
      timers.forEach((id) => window.clearTimeout(id));
      listeners.forEach(([type, handler]) => window.removeEventListener(type, handler));
    }
    return cleanup;
  }, [enabled, onTrigger]);
}

/** Site-wide enquiry popup, mounted once at the app root. */
function EnquiryPopup() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // The Contact page already shows the form, and engaged visitors are never interrupted.
  const [enabled] = useState(
    () => !/^\/contacts\/?$/.test(window.location.pathname) && !hasEnquiryEngaged(),
  );

  const openPopup = useCallback(() => {
    markEnquiryEngaged();
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);
  useScrollTrigger(enabled && !open, openPopup);

  // A ref (not state) guards double closes, so close() keeps a stable identity and the
  // scroll-lock effect below does not re-run while the exit animation plays.
  const closingRef = useRef(false);
  const close = useCallback(() => {
    if (closingRef.current) return;
    if (prefersReducedMotion()) {
      setOpen(false);
      return;
    }
    closingRef.current = true;
    setClosing(true);
    window.setTimeout(() => {
      closingRef.current = false;
      setClosing(false);
      setOpen(false);
    }, CLOSE_ANIMATION_MS);
  }, []);

  // Lock background scrolling while open and restore focus afterwards.
  useEffect(() => {
    if (!open) return;
    const { body, documentElement } = document;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    dialogRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      returnFocus.current?.focus?.();
    };
  }, [open, close]);

  // Keep keyboard focus inside the dialog.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (element) => element.offsetParent !== null,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const activeElement = document.activeElement;
    if (event.shiftKey && (activeElement === first || activeElement === dialogRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <div
      className={`ep-overlay ${closing ? "is-closing" : ""}`}
      onMouseDown={(event) => {
        // Only a press that starts on the overlay itself closes (not text selection drags).
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        className="ep-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ep-title"
        aria-describedby="ep-description"
        tabIndex={-1}
        onKeyDown={trapFocus}
      >
        <button type="button" className="ep-close" onClick={close} aria-label="Close enquiry form">
          <X aria-hidden="true" />
        </button>
        <div className="ep-head">
          <span className="ep-kicker">
            <i aria-hidden="true" />
            START A CONVERSATION
            <i aria-hidden="true" />
          </span>
          <h2 id="ep-title">
            Let&apos;s Build Something <em>Meaningful.</em>
          </h2>
          <p id="ep-description">
            Have a project in mind? Share your details and our team will get in touch with you.
          </p>
          <p className="ep-required">
            Fields marked <span className="cp-req">*</span> are required.
          </p>
        </div>
        <div className="ep-body">
          <EnquiryForm idPrefix="ep" showHead={false} />
        </div>
      </div>
    </div>
  );
}

export default EnquiryPopup;
