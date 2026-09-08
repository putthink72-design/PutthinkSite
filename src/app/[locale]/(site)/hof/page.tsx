"use client";

import { useI18n } from "@/i18n/provider";
import { MOCK_HOF } from "@/lib/mock-data";

export default function HofPage() {
  const { dict } = useI18n();
  const t = dict.hof;

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
                  <div className="n">{item.user}</div>
                  <div className="d mono">{item.detail}</div>
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
