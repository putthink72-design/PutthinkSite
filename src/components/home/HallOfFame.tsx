"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import { MOCK_HOF, formatHoleLocation } from "@/lib/mock-data";

export function HallOfFame() {
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
          {MOCK_HOF.map((item) => (
            <div className="hcard" key={item.period}>
              <div className="th">
                <span className="mo mono">{item.period}</span>
                <span className="cr" aria-hidden="true">
                  ★
                </span>
              </div>
              <div className="hb">
                <div className="n">{item.nickname}</div>
                <div className="ct">{item.caption}</div>
                <div className="loc">
                  {formatHoleLocation(
                    item.clubName,
                    item.courseName,
                    item.holeNumber,
                    s.holeUnit,
                  )}
                </div>
                <div className="cat-tag">{s.cats[item.category]}</div>
                <div className="auto">{t.autoSelected}</div>
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
