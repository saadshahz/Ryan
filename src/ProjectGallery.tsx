import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, Images, Play, X } from "lucide-react";
import type { ProjectImage } from "./projectData";

const pad = (value: number) => String(value).padStart(2, "0");
const wrap = (index: number, count: number) => (index + count) % count;

/** Pauses every other video on the page, so only one plays at a time. */
function pauseOtherVideos(current: HTMLVideoElement) {
  document.querySelectorAll("video").forEach((video) => {
    if (video !== current && !video.paused) video.pause();
  });
}

/**
 * A gallery video in the viewer: native controls (play, pause, volume, seek, fullscreen),
 * metadata-only preload, and no autoplay unless the visitor opened this video directly.
 * Unmounting (closing the viewer or moving to another item) stops playback and the download.
 */
function GalleryVideo({ item, autoPlay }: { item: ProjectImage; autoPlay: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const video = item.video!;
  const [failed, setFailed] = useState(() => !document.createElement("video").canPlayType(video.type));

  useEffect(() => {
    const element = ref.current;
    if (element && autoPlay) element.play().catch(() => {});
    return () => {
      if (!element) return;
      element.pause();
      element.removeAttribute("src");
      element.load();
    };
  }, [autoPlay]);

  if (failed) {
    return (
      <div className="pd-video-error" role="status">
        <img src={item.src} alt="" />
        <p>
          This video could not be played here.{" "}
          <a href={video.src} target="_blank" rel="noopener noreferrer">
            Open the video file
          </a>
        </p>
      </div>
    );
  }

  return (
    <video
      ref={ref}
      className="pd-lightbox-video pd-fade"
      src={video.src}
      poster={item.src}
      controls
      playsInline
      preload="metadata"
      style={video.aspectRatio ? { aspectRatio: video.aspectRatio } : undefined}
      aria-label={item.alt}
      onPlay={(event) => pauseOtherVideos(event.currentTarget)}
      onError={() => setFailed(true)}
    >
      <a href={video.src}>Download the video</a>
    </video>
  );
}

export function Lightbox({
  images,
  index,
  title,
  onIndex,
  onClose,
  autoPlayIndex,
}: {
  images: ProjectImage[];
  index: number;
  title: string;
  onIndex: (index: number) => void;
  onClose: () => void;
  /** Index of a video the visitor clicked to open: it starts playing. Others never autoplay. */
  autoPlayIndex?: number;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);
  const count = images.length;
  const go = (step: number) => onIndex(wrap(index + step, count));

  // Lock page scroll, move focus into the dialog, and restore both on close.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const inVideo = document.activeElement instanceof HTMLVideoElement;
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft" && !inVideo) go(-1);
      else if (event.key === "ArrowRight" && !inVideo) go(1);
      else if (event.key === "Tab" && dialogRef.current) {
        const focusable = [
          ...dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), video, a[href]"),
        ];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onPointerDown = (event: ReactPointerEvent) => {
    if (event.target instanceof HTMLVideoElement) {
      swipeStart.current = null;
      return;
    }
    swipeStart.current = event.clientX;
    swiped.current = false;
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    if (swipeStart.current === null) return;
    const distance = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(distance) > 50) {
      swiped.current = true;
      go(distance < 0 ? 1 : -1);
    }
  };

  const current = images[index];

  return createPortal(
    <div
      ref={dialogRef}
      className="pd-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="pd-lightbox-bar">
        <span className="pd-lightbox-count" aria-live="polite">
          {pad(index + 1)} <i>/</i> {pad(count)}
        </span>
        <span className="pd-lightbox-title">{title}</span>
        <button
          ref={closeRef}
          type="button"
          className="pd-lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          <X aria-hidden="true" />
        </button>
      </div>

      <div
        className={`pd-lightbox-stage ${current.video ? "has-video" : ""}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClick={(event) => !swiped.current && event.target === event.currentTarget && onClose()}
      >
        {count > 1 && (
          <button
            type="button"
            className="pd-lightbox-nav prev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        <figure className={current.video ? "is-video" : undefined}>
          {current.video ? (
            <GalleryVideo key={current.video.src} item={current} autoPlay={index === autoPlayIndex} />
          ) : (
            <img loading="lazy" decoding="async" key={current.src} className="pd-fade" src={current.src} alt={current.alt} draggable={false} />
          )}
          <figcaption>{current.video ? current.video.title : current.alt}</figcaption>
        </figure>
        {count > 1 && (
          <button
            type="button"
            className="pd-lightbox-nav next"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        )}
      </div>

      {count > 1 && (
        <div className="pd-lightbox-thumbs">
          {images.map((item, itemIndex) => (
            <button
              key={item.video?.src ?? item.src}
              type="button"
              className={itemIndex === index ? "is-active" : undefined}
              onClick={() => onIndex(itemIndex)}
              aria-label={`Show ${item.video ? "video" : "image"} ${itemIndex + 1} of ${count}`}
              aria-current={itemIndex === index ? "true" : undefined}
            >
              <img loading="lazy" decoding="async" src={item.src} alt="" draggable={false} />
              {item.video && (
                <span className="pd-thumb-play" aria-hidden="true">
                  <Play />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

export default function ProjectGallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // The video the visitor clicked to open the viewer (it plays straight away).
  const [autoPlayIndex, setAutoPlayIndex] = useState<number | undefined>(undefined);
  const count = images.length;
  const hasVideo = images.some((item) => item.video);
  const open = (index: number) => {
    setAutoPlayIndex(images[index]?.video ? index : undefined);
    setLightboxIndex(index);
  };
  if (count === 0) return null;

  // The two side tiles show the images that follow the active one, so every photo is reachable.
  const sideIndexes = [1, 2]
    .filter((offset) => offset < count)
    .map((offset) => wrap(active + offset, count));
  const current = images[active];

  return (
    <div className="pd-gallery reveal">
      <div className={`pd-gallery-grid ${sideIndexes.length === 0 ? "single" : ""}`}>
        <button
          type="button"
          className="pd-gallery-main"
          onClick={() => open(active)}
          aria-label={current.video ? `Play video: ${current.alt}` : `Open fullscreen: ${current.alt}`}
        >
          <img key={current.src} className="pd-fade" src={current.src} alt={current.alt} />
          {current.video && (
            <span className="pd-gallery-play" aria-hidden="true">
              <span className="pd-gallery-play-icon">
                <Play />
              </span>
              <small>Play Film</small>
            </span>
          )}
          <span className="pd-gallery-count">
            {pad(active + 1)} <i>/</i> {pad(count)}
          </span>
          {!current.video && (
            <span className="pd-gallery-expand" aria-hidden="true">
              <Expand />
            </span>
          )}
        </button>
        {sideIndexes.length > 0 && (
          <div className="pd-gallery-side">
            {sideIndexes.map((imageIndex) => (
              <button
                type="button"
                key={images[imageIndex].video?.src ?? images[imageIndex].src}
                className="pd-gallery-thumb"
                onClick={() => setActive(imageIndex)}
                aria-label={`Show ${images[imageIndex].video ? "video" : "image"} ${imageIndex + 1} of ${count}: ${images[imageIndex].alt}`}
              >
                <img src={images[imageIndex].src} alt="" loading="lazy" />
                {images[imageIndex].video && (
                  <span className="pd-thumb-play" aria-hidden="true">
                    <Play />
                  </span>
                )}
                <span className="pd-gallery-thumb-index">{pad(imageIndex + 1)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="pd-gallery-actions">
        <div className="pd-gallery-dots" aria-hidden="true">
          {images.map((item, itemIndex) => (
            <i key={item.video?.src ?? item.src} className={itemIndex === active ? "is-active" : undefined} />
          ))}
        </div>
        <div className="pd-gallery-buttons">
          <button type="button" className="pd-line-button" onClick={() => open(active)}>
            <Images aria-hidden="true" /> {hasVideo ? "View Photos & Films" : "View More Photos"}
          </button>
          <a href="#overview" className="pd-line-button">
            Project Overview
          </a>
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          title={title}
          autoPlayIndex={autoPlayIndex}
          onIndex={(index) => {
            setAutoPlayIndex(undefined);
            setLightboxIndex(index);
          }}
          onClose={() => {
            setActive(lightboxIndex);
            setLightboxIndex(null);
          }}
        />
      )}
    </div>
  );
}
