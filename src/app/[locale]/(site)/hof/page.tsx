"use client";

import { useI18n } from "@/i18n/provider";
import { MOCK_HOF, formatHoleLocation } from "@/lib/mock-data";

export default function HofPage() {
  const { dict } = useI18n();
  const t = dict.hof;
  const s = dict.showcase;

  return (
    <>
      <header className="page-hero light">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.title}</h1>
          <p className="sub" style={{ color: "var(--g-2)" }}>
            {t.pageSub}
          </p>
        </div>
      </header>
      <section className="sec light" style={{ paddingTop: 0 }}>
        <div className="wrap">
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
        </div>
      </section>
    </>
  );
}
