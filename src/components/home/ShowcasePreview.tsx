"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import type { LiveShowcaseCard } from "@/lib/showcase-data";
import { ShowcaseCardView } from "@/components/showcase/ShowcaseCardView";

export function ShowcasePreview({ items }: { items: LiveShowcaseCard[] }) {
  const { dict } = useI18n();
  const t = dict.showcase;

  return (
    <section className="sec light" id="showcase">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>{t.title}</h2>
          <p className="sub">
            {t.subBefore}
            <b>{t.subBold}</b>
            {t.subAfter}
          </p>
        </div>

        <div className="cats">
          <span className="cat on">{t.cats.all}</span>
          <span className="cat">{t.cats.long_putt}</span>
          <span className="cat">{t.cats.multi_break}</span>
          <span className="cat">{t.cats.recovery}</span>
          <span className="cat">{t.cats.first_holed}</span>
        </div>

        <div className="feed">
          {items.map((item) => (
            <ShowcaseCardView key={item.id} item={item} />
          ))}
        </div>

        <p style={{ marginTop: 28, textAlign: "center" }}>
          <LocaleLink
            href="/showcase"
            style={{
              fontSize: 14,
              fontWeight: 700,
              borderBottom: "1px solid var(--line-l)",
            }}
          >
            {t.viewAll}
          </LocaleLink>
        </p>
      </div>
    </section>
  );
}
