"use client";

import { useCallback, useRef, useState } from "react";

/** Seek past a black keyframe so the poster frame is visible while paused. */
function revealFirstFrame(el: HTMLVideoElement) {
  const paint = () => {
    if (!Number.isFinite(el.duration) || el.duration <= 0) {
      el.currentTime = 0.001;
      return;
    }
    el.currentTime = Math.min(0.1, el.duration * 0.01);
  };

  if (el.readyState >= 1) paint();
  else el.addEventListener("loadedmetadata", paint, { once: true });
}

type Props = {
  src: string;
  className?: string;
  /** Showcase cards keep native controls; HoF thumbs stay static. */
  controls?: boolean;
};

export function VideoThumb({ src, className, controls = false }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ratio, setRatio] = useState("9 / 16");

  const onReady = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.videoWidth > 0 && el.videoHeight > 0) {
      setRatio(`${el.videoWidth} / ${el.videoHeight}`);
    }
    revealFirstFrame(el);
  }, []);

  return (
    <div className="video-thumb-frame" style={{ aspectRatio: ratio }}>
      <video
        ref={ref}
        className={className}
        src={src}
        muted
        playsInline
        preload="metadata"
        controls={controls}
        loop={controls}
        onLoadedMetadata={onReady}
        onLoadedData={onReady}
      />
    </div>
  );
}
