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

type HeroSources = { webm: string; mp4: string };

/** Muted preview — plays on page load */
const HERO_LOOP: HeroSources = {
  webm: "/hero/phone-loop.webm",
  mp4: "/hero/phone-loop.mp4",
};
/** Phone tap — shorter demo with sound */
const HERO_DEMO: HeroSources = {
  webm: "/hero/phone.webm",
  mp4: "/hero/phone.mp4",
};
/** Full Demo button — full-length demo with sound */
const HERO_FULL: HeroSources = {
  webm: "/hero/phonefull.webm",
  mp4: "/hero/phonefull.mp4",
};
const HERO_POSTER = "/hero/phone-poster.jpg";

function VideoSources({ sources }: { sources: HeroSources }) {
  return (
    <>
      <source src={sources.webm} type="video/webm" />
      <source src={sources.mp4} type="video/mp4" />
    </>
  );
}

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
  const [modalSources, setModalSources] = useState<HeroSources | null>(null);
  const [loopPlaying, setLoopPlaying] = useState(false);
  const loopRef = useRef<HTMLVideoElement>(null);
  const fullRef = useRef<HTMLVideoElement>(null);
  const open = modalSources !== null;

  useEffect(() => {
    if (open) return;
    const el = loopRef.current;
    if (!el) return;
    void playMuted(el).then(() => {
      if (!el.paused) setLoopPlaying(true);
    });
  }, [open]);

  const openModal = useCallback((sources: HeroSources) => {
    const loop = loopRef.current;
    if (loop) {
      loop.pause();
      setLoopPlaying(false);
    }
    setModalSources(sources);
  }, []);

  const closeModal = useCallback(() => {
    const full = fullRef.current;
    if (full) {
      full.pause();
      full.currentTime = 0;
    }
    setModalSources(null);
  }, []);

  useEffect(() => {
    if (!modalSources) return;

    const id = window.setTimeout(() => {
      const full = fullRef.current;
      if (!full) return;
      full.muted = false;
      full.currentTime = 0;
      void full.play().catch(() => {});
    }, 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [modalSources, closeModal]);

  const onPhoneKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(HERO_DEMO);
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
            onClick={() => openModal(HERO_DEMO)}
            onKeyDown={onPhoneKey}
            aria-label={t.playDemo}
          >
            <div className="scr scr-video">
              <video
                ref={loopRef}
                className="phone-vid"
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
              >
                <VideoSources sources={HERO_LOOP} />
              </video>
              {!loopPlaying && !open ? (
                <span className="phone-play" aria-hidden="true">
                  ▶
                </span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="phone-full-demo"
            onClick={() => openModal(HERO_FULL)}
          >
            {t.fullDemo}
          </button>
        </div>
      </div>

      {modalSources ? (
        <div
          className="vid-modal"
          role="dialog"
          aria-modal="true"
          aria-label={
            modalSources.webm === HERO_FULL.webm ? t.fullDemo : t.playDemo
          }
          onClick={closeModal}
        >
          <div className="vid-modal-panel" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="vid-modal-close"
              onClick={closeModal}
              aria-label={t.closeDemo}
            >
              ×
            </button>
            <video
              key={modalSources.webm}
              ref={fullRef}
              className="vid-modal-player"
              poster={HERO_POSTER}
              controls
              playsInline
              preload="auto"
            >
              <VideoSources sources={modalSources} />
            </video>
          </div>
        </div>
      ) : null}
    </header>
  );
}
