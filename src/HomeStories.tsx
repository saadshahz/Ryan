
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

type Story = {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  /** Path to a real file in /public. Leave undefined until the file exists — the card then shows its poster and is skipped by the playlist. */
  videoSrc?: string;
  posterSrc: string;
  posterAlt: string;
};

const base = import.meta.env.BASE_URL;

// Add footage by placing the file in /public and setting videoSrc,
// e.g. `${base}construction.mp4` for "public/construction.mp4" (encode spaces as %20).
const stories: Story[] = [
  {
    id: "craft",
    number: "01",
    title: "The Art of Building",
    category: "Construction",
    description: "Every detail reflects our commitment to precision and quality.",
    videoSrc: `${base}construction.mp4`,
    posterSrc:
      "https://images.unsplash.com/photo-1608619769165-25647672335f?auto=format&fit=crop&w=900&q=85",
    posterAlt: "Concrete structure under construction with exposed formwork and scaffolding",
  },
  {
    id: "vision",
    number: "02",
    title: "Designed for Tomorrow",
    category: "Architecture",
    description: "A vision shaped by thoughtful design and enduring value.",
    videoSrc: `${base}architecture.mp4`,
    posterSrc:
      "https://images.unsplash.com/photo-1614595737476-42487331b8a1?auto=format&fit=crop&w=1000&q=86",
    posterAlt: "Contemporary residential architecture with clean facades and landscaped grounds",
  },
  {
    id: "journey",
    number: "03",
    title: "Behind the Structure",
    category: "Behind the Scenes",
    description: "Discover the people, process, and purpose behind our work.",
    videoSrc: `${base}Bts.mp4`,
    posterSrc:
      "https://images.unsplash.com/photo-1760296404241-2d60056d401f?auto=format&fit=crop&w=900&q=85",
    posterAlt: "Architectural plans and site planning materials laid out for review",
  },
];

/** Story indexes that have a real video, in playback order. */
const playlist = stories.flatMap((story, index) => (story.videoSrc ? [index] : []));

// Hysteresis so minor scrolling near the edge doesn't stop/start playback.
const START_RATIO = 0.4;
const STOP_RATIO = 0.15;

function nextIn(list: number[], index: number) {
  if (list.length === 0) return index;
  const position = list.indexOf(index);
  return list[(position + 1) % list.length];
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="story-icon">
      <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="story-icon">
      <path d="M7.5 5h3v14h-3zM13.5 5h3v14h-3z" fill="currentColor" />
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="story-icon">
      <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4v-5Z" fill="currentColor" />
      {muted ? (
        <path d="m16 9.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.6" />
      ) : (
        <path
          d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      )}
    </svg>
  );
}

type CardProps = {
  story: Story;
  active: boolean;
  playing: boolean;
  started: boolean;
  progress: number;
  preload: "auto" | "metadata" | "none";
  videoRef: (element: HTMLVideoElement | null) => void;
  onSelect: () => void;
  onTogglePlay: () => void;
  onPlayState: (playing: boolean) => void;
  onProgress: (progress: number) => void;
  onEnded: () => void;
  onError: () => void;
};

function StoryCard({
  story,
  active,
  playing,
  started,
  progress,
  preload,
  videoRef,
  onSelect,
  onTogglePlay,
  onPlayState,
  onProgress,
  onEnded,
  onError,
}: CardProps) {
  const hasVideo = Boolean(story.videoSrc);

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    if (!hasVideo || active || (event.target as HTMLElement).closest("button")) return;
    onSelect();
  };

  return (
    <article
      className={`story-card story-card-${story.id} ${active ? "is-active" : ""} ${playing ? "is-playing" : ""} ${started ? "is-started" : ""} ${hasVideo ? "has-video" : ""}`}
      onClick={handleCardClick}
    >
      <div className="story-media">
        <img src={story.posterSrc} alt={story.posterAlt} loading="lazy" />
        {hasVideo && (
          <video
            ref={videoRef}
            src={story.videoSrc}
            poster={story.posterSrc}
            preload={preload}
            playsInline
            aria-label={`${story.title} video`}
            onPlay={() => onPlayState(true)}
            onPause={() => onPlayState(false)}
            onEnded={onEnded}
            onTimeUpdate={(event) => {
              const { currentTime, duration } = event.currentTarget;
              if (duration) onProgress(currentTime / duration);
            }}
            onError={onError}
          />
        )}
      </div>
      <div className="story-overlay" aria-hidden="true" />
      <span className="story-number" aria-hidden="true">
        {story.number}
      </span>
      {active && playing && (
        <span className="story-live" aria-hidden="true">
          <i />
          Now Playing
        </span>
      )}
      <span className="story-frame" aria-hidden="true" />

      <div className="story-content">
        <span className="story-category">
          <i aria-hidden="true" />
          {story.category}
        </span>
        <h3>{story.title}</h3>
        <p>{story.description}</p>

        <div className="story-controls">
          {hasVideo ? (
            <>
              <button
                type="button"
                className="story-play"
                onClick={onTogglePlay}
                aria-label={`${active && playing ? "Pause" : "Play"} ${story.title} video`}
              >
                {active && playing ? <PauseIcon /> : <PlayIcon />}
              </button>
              <div className="story-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
            </>
          ) : (
            <span className="story-soon">Film coming soon</span>
          )}
        </div>
      </div>
    </article>
  );
}

function HomeStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(playlist[0] ?? 0);
  // Bumped when a single-video playlist loops, so the play effect re-runs.
  const [cycle, setCycle] = useState(0);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [userPaused, setUserPaused] = useState(false);
  // Starts muted: the films play silently, and visitors can switch sound on with the button.
  const [mutedByUser, setMutedByUser] = useState(true);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [startedSet, setStartedSet] = useState<Set<number>>(() => new Set());
  const [progress, setProgress] = useState<number[]>(() => stories.map(() => 0));
  const [failed, setFailed] = useState<Set<number>>(() => new Set());

  const muted = mutedByUser || soundBlocked;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const playable = playlist.filter((index) => !failed.has(index));
  const hasPlaylist = playable.length > 0;
  const shouldPlay = hasPlaylist && inView && pageVisible && !userPaused;

  // Respect reduced-motion: no autoplay; the visitor can still press play.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setUserPaused(true);
  }, []);

  // Section visibility with hysteresis.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasPlaylist) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Ratio relative to the viewport, since the section can be taller than the screen.
        const viewport = entry.rootBounds?.height || window.innerHeight;
        const visible = entry.intersectionRect.height / Math.min(viewport, entry.boundingClientRect.height);
        if (visible >= START_RATIO) setInView(true);
        else if (visible < STOP_RATIO) setInView(false);
      },
      { threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [hasPlaylist]);

  // Pause when the browser tab is hidden.
  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const attemptPlay = useCallback((video: HTMLVideoElement) => {
    video.muted = mutedRef.current;
    video.play().catch((error: DOMException) => {
      if (error.name !== "NotAllowedError") return; // AbortError = interrupted by a pause; ignore.
      if (!video.muted) {
        // Autoplay with sound blocked: fall back to muted once and surface "Enable Sound".
        video.muted = true;
        setSoundBlocked(true);
        video.play().catch(() => {
          // Even muted autoplay is blocked: stay paused and show the play button.
          setUserPaused(true);
        });
      } else {
        setUserPaused(true);
      }
    });
  }, []);

  // Single source of truth: only the active video may play, and only while shouldPlay.
  useEffect(() => {
    videos.current.forEach((video, index) => {
      if (video && index !== activeIndex && !video.paused) video.pause();
    });
    const active = videos.current[activeIndex];
    if (!active) return;
    if (shouldPlay) attemptPlay(active);
    else if (!active.paused) active.pause();
  }, [activeIndex, shouldPlay, cycle, attemptPlay]);

  // On the mobile carousel, bring the active card into view horizontally (never scrolls the page).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !inView || track.scrollWidth <= track.clientWidth) return;
    const slot = track.children[activeIndex] as HTMLElement | undefined;
    if (!slot) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left:
        track.scrollLeft +
        slot.getBoundingClientRect().left -
        track.getBoundingClientRect().left -
        parseFloat(getComputedStyle(track).paddingLeft || "0"),
      behavior: reduce ? "auto" : "smooth",
    });
  }, [activeIndex, inView]);

  // Keep every video on the same sound setting.
  useEffect(() => {
    videos.current.forEach((video) => {
      if (video) video.muted = muted;
    });
  }, [muted]);

  const handleEnded = (index: number) => {
    const video = videos.current[index];
    if (video) video.currentTime = 0;
    setProgress((current) => current.map((value, i) => (i === index ? 0 : value)));
    if (index !== activeIndex) return;
    const next = nextIn(playable, index);
    if (next === index) setCycle((value) => value + 1);
    else setActiveIndex(next);
  };

  const select = (index: number) => {
    setActiveIndex(index);
    setUserPaused(false);
    setInView(true); // The visitor is interacting with the section, so treat it as in view.
  };

  const togglePlay = (index: number) => {
    if (index !== activeIndex) return select(index);
    if (playingIndex === index) {
      setUserPaused(true);
    } else {
      setUserPaused(false);
      setInView(true);
    }
  };

  const toggleSound = () => {
    const nextMuted = !muted;
    // Apply synchronously inside the click so the browser counts it as a user gesture.
    videos.current.forEach((video) => {
      if (video) video.muted = nextMuted;
    });
    setMutedByUser(nextMuted);
    setSoundBlocked(false);
    if (!nextMuted) {
      const active = videos.current[activeIndex];
      if (active && active.paused && inView) {
        setUserPaused(false);
        active.play().catch(() => undefined);
      }
    }
  };

  const activeStory = stories[activeIndex];
  const position = playable.indexOf(activeIndex) + 1;

  return (
    <section
      id="inside-ryan-group"
      ref={sectionRef}
      className="section inside-section"
      aria-labelledby="inside-title"
    >
      <span className="inside-grid" aria-hidden="true" />
      <div className="container">
        <div className="inside-heading">
          <div className="section-title reveal">
            <div className="eyebrow">
              <span />
              INSIDE RYAN GROUP
            </div>
            <h2 id="inside-title">
              Behind Every Structure,
              <br />
              <em>There Is a Story.</em>
            </h2>
          </div>
          <div className="inside-aside reveal">
            <p>
              Explore the craftsmanship, vision, and dedication that shape every Ryan Group
              project.
            </p>
            <div className="inside-signature" aria-hidden="true">
              <span className="inside-rule" />
              RYAN GROUP <b>/</b> STORIES
            </div>
          </div>
        </div>

        {hasPlaylist && (
          <div className="inside-player-bar reveal">
            <p className="inside-now" aria-live="polite">
              <span>
                {String(position).padStart(2, "0")} / {String(playable.length).padStart(2, "0")}
              </span>
              <i aria-hidden="true" />
              {playingIndex !== null ? "Now playing" : "Paused"}: <strong>{activeStory.title}</strong>
            </p>
            <button
              type="button"
              className={`inside-sound ${soundBlocked ? "is-blocked" : ""} ${muted ? "" : "is-on"}`}
              onClick={toggleSound}
              aria-pressed={!muted}
              aria-label={muted ? "Enable sound" : "Mute sound"}
            >
              <SoundIcon muted={muted} />
              {soundBlocked ? "Enable Sound" : muted ? "Sound Off" : "Sound On"}
            </button>
          </div>
        )}

        <div className="inside-track" ref={trackRef}>
          {stories.map((story, index) => {
            const isActive = index === activeIndex && playable.includes(index);
            // Nothing is fetched in full until the section is on screen.
            const preload =
              isActive && inView
                ? "auto"
                : isActive || (playable.includes(index) && index === nextIn(playable, activeIndex))
                  ? "metadata"
                  : "none";
            return (
              <div
                key={story.id}
                className={`inside-slot inside-slot-${index + 1} reveal`}
                style={{ "--story-delay": `${0.12 + index * 0.14}s` } as CSSProperties}
              >
                <StoryCard
                  story={failed.has(index) ? { ...story, videoSrc: undefined } : story}
                  active={isActive}
                  playing={playingIndex === index}
                  started={startedSet.has(index)}
                  progress={progress[index]}
                  preload={preload}
                  videoRef={(element) => {
                    videos.current[index] = element;
                  }}
                  onSelect={() => select(index)}
                  onTogglePlay={() => togglePlay(index)}
                  onPlayState={(isPlaying) => {
                    if (isPlaying) {
                      setPlayingIndex(index);
                      setStartedSet((current) => (current.has(index) ? current : new Set(current).add(index)));
                    } else {
                      setPlayingIndex((current) => (current === index ? null : current));
                    }
                  }}
                  onProgress={(value) =>
                    setProgress((current) => current.map((old, i) => (i === index ? value : old)))
                  }
                  onEnded={() => handleEnded(index)}
                  onError={() => {
                    setFailed((current) => new Set(current).add(index));
                    if (index === activeIndex) {
                      const remaining = playable.filter((i) => i !== index);
                      if (remaining.length) setActiveIndex(nextIn(playable, index));
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeStories;
