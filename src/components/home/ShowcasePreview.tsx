"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import { MOCK_SHOWCASE } from "@/lib/mock-data";

export function ShowcasePreview() {
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
          {MOCK_SHOWCASE.map((item) => (
            <article className="card" key={item.id}>
              <div className="card-v">
                <div className="rank">{item.rank}</div>
                <div className="meta">
                  {item.chips.map((c) => (
                    <span key={c.text} className={`chip${c.hot ? " hot" : ""}`}>
                      {c.text}
                    </span>
                  ))}
                </div>
              </div>
              <div className="card-b">
                <div className="u">
                  <div className="av" />
                  <div className="un">{item.user}</div>
                </div>
                <div className="ct">{item.caption}</div>
                <div className="lk">
                  <span>{item.meta}</span>
                  <span>
                    <b>{item.likes}</b> {t.likes}
                  </span>
                </div>
              </div>
            </article>
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
