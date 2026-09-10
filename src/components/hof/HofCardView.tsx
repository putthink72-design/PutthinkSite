"use client";

import { useI18n } from "@/i18n/provider";
import type { LiveHofCard } from "@/lib/showcase-data";
import { VideoThumb } from "@/components/VideoThumb";

function hofMeta(item: LiveHofCard, holeUnit: string, catLabel: string) {
  return `${item.clubName} · ${item.courseName} · ${item.holeNumber}${holeUnit} · ${catLabel}`;
}

export function HofCardView({ item }: { item: LiveHofCard }) {
  const { dict } = useI18n();
  const s = dict.showcase;

  return (
    <div className="hcard">
      <div className="th">
        {item.videoUrl ? (
          <VideoThumb className="hof-video" src={item.videoUrl} />
        ) : null}
        <span className="mo mono">{item.period}</span>
        <span className="cr" aria-hidden="true">
          🏆
        </span>
      </div>
      <div className="hb">
        <div className="n">{item.nickname}</div>
        <div className="ct">{item.caption}</div>
        <div className="d mono">
          {hofMeta(item, s.holeUnit, s.cats[item.category])}
        </div>
      </div>
    </div>
  );
}
