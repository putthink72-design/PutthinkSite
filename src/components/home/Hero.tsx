"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { AppStoreButton } from "@/components/AppStoreButton";
import { useI18n } from "@/i18n/provider";

/** Muted preview — plays on page load */
const HERO_LOOP = "/hero/phone-loop.mp4";
/** Full quality + sound — plays on click */
const HERO_FULL = "/hero/phone.mp4";
const HERO_POSTER = "/hero/phone-poster.jpg";

async function playMuted(el: HTMLVideoElement) {
  el.defaultMuted = true;
  el.muted = true;
  el.playsInline = true;
  el.setAttribute("muted", "");
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "");
  try {
    await el.play();
  } catch {
    // Retry once after metadata is ready
    await new Promise<void>((resolve) => {
      const done = () => {
        el.removeEventListener("canplay", done);
        resolve();
      };
      el.addEventListener("canplay", done, { once: true });
      el.load();
    });
    await el.play().catch(() => {});
  }
}

export function Hero() {
  const { dict } = useI18n();
  const t = dict.hero;
  const [open, setOpen] = useState(false);
  const [loopPlaying, setLoopPlaying] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);

  // First visit / after closing modal: start muted loop
  useEffect(() => {
    if (open) return;
    const el = loopRef.current;
    if (!el) return;
    void playMuted(el).then(() => {
      if (!el.paused) setLoopPlaying(true);
    });
  }, [open]);

  const openFull = useCallback(() => {
    const loop = loopRef.current;
    if (loop) {
      loop.pause();
      setLoopPlaying(false);
    }
    setOpen(true);
  }, []);

  const closeFull = useCallback(() => {
    const full = fullRef.current;
    if (full) {
      full.pause();
      full.currentTime = 0;
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => {
      const full = fullRef.current;
      if (!full) return;
      full.muted = false;
      full.currentTime = 0;
      void full.play().catch(() => {});
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFull();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, closeFull]);

  const onPhoneKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFull();
    }
  };

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div>
          <span className="kicker">
            <s />
            {t.kicker}
          </span>
          <h1>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h1>
          <p className="lede">{t.lede}</p>
          <div className="hero-cta">
            <AppStoreButton />
            <div className="free-note">
              {t.freeNoteBefore}
              <b>{t.freeNoteHighlight}</b>
              {t.freeNoteAfter}
            </div>
          </div>
        </div>

        <div className="phone-col">
          <div
            className="phone phone-hit"
            role="button"
            tabIndex={0}
            onClick={openFull}
            onKeyDown={onPhoneKey}
            aria-label={t.playDemo}
          >
            <div className="scr scr-video">
              <video
                ref={loopRef}
                className="phone-vid"
                src={HERO_LOOP}
                poster={HERO_POSTER}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                controls={false}
                onPlaying={() => setLoopPlaying(true)}
                onPause={() => {
                  if (!open) setLoopPlaying(false);
                }}
              />
              {!loopPlaying && !open ? (
                <span className="phone-play" aria-hidden="true">
                  ▶
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className="vid-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t.playDemo}
          onClick={closeFull}
        >
          <div className="vid-modal-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vid-modal-close"
              onClick={closeFull}
              aria-label={t.closeDemo}
            >
              ×
            </button>
            <video
              ref={fullRef}
              className="vid-modal-player"
              src={HERO_FULL}
              poster={HERO_POSTER}
              controls
              playsInline
              preload="auto"
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
