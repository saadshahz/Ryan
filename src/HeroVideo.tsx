import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  type?: string;
  /** Shown before the first frame and kept as the fallback (the hero's existing image). */
  poster: string;
};

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

/** Visitors who prefer reduced motion or asked their browser to save data keep the still image. */
function shouldSkipVideo() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia?.(reducedMotionQuery).matches) return true;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return Boolean(connection?.saveData);
}

/**
 * Muted, looping background film for the homepage hero.
 * - The still hero image stays underneath as the poster and fallback.
 * - Nothing is downloaded for reduced-motion or data-saver visitors, and the film is removed
 *   if it fails to load.
 * - Playback pauses while the hero is off screen and resumes when it returns.
 */
export default function HeroVideo({ src, type = "video/mp4", poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [skip, setSkip] = useState(shouldSkipVideo);
  const [ready, setReady] = useState(false);

  // Follow changes to the reduced-motion setting while the page is open.
  useEffect(() => {
    const query = window.matchMedia?.(reducedMotionQuery);
    if (!query) return;
    const onChange = () => setSkip(shouldSkipVideo());
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    // React does not reliably reflect `muted` as an attribute; set it before playing so the
    // browser's autoplay policy allows it.
    video.muted = true;
    video.defaultMuted = true;
    const play = () => video.play().catch(() => {});
    play();

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) play();
      else video.pause();
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [skip]);

  if (skip) return null;

  return (
    <video
      ref={ref}
      className={`hero-video ${ready ? "is-ready" : ""}`}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => setReady(true)}
      onError={() => setSkip(true)}
    >
      <source src={src} type={type} onError={() => setSkip(true)} />
    </video>
  );
}
