"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import type { LiveHofCard } from "@/lib/showcase-data";

function hofMeta(item: LiveHofCard, holeUnit: string, catLabel: string) {
  return `${item.clubName} · ${item.courseName} · ${item.holeNumber}${holeUnit} · ${catLabel}`;
}

export function HallOfFame({ items }: { items: LiveHofCard[] }) {
  const { dict } = useI18n();
  const t = dict.hof;
  const s = dict.showcase;

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
            <div className="hcard" key={`${item.period}-${item.id}`}>
              <div className="th">
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
