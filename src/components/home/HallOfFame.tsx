"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { HofCardView } from "@/components/hof/HofCardView";
import { useI18n } from "@/i18n/provider";
import type { LiveHofCard } from "@/lib/showcase-data";

export function HallOfFame({ items }: { items: LiveHofCard[] }) {
  const { dict } = useI18n();
  const t = dict.hof;

  return (
    <section className="sec light" id="hof">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>{t.title}</h2>
          <p className="sub">
            {t.subBefore}
            <b style={{ color: "var(--ink)" }}>{t.subBold}</b>
            {t.subAfter}
          </p>
        </div>
        <div className="hof">
          {items.map((item) => (
            <HofCardView key={`${item.period}-${item.id}`} item={item} />
          ))}
        </div>
        <p style={{ marginTop: 28, textAlign: "center" }}>
          <LocaleLink
            href="/hof"
            style={{
              fontSize: 14,
              fontWeight: 700,
              borderBottom: "1px solid var(--line-l)",
            }}
          >
            {t.archive}
          </LocaleLink>
        </p>
      </div>
    </section>
  );
}
