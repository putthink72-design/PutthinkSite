"use client";

import { useI18n } from "@/i18n/provider";
import { PATENTS } from "@/lib/mock-data";

export default function TechnologyPage() {
  const { dict } = useI18n();
  const t = dict.technology;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h1>
          <p className="sub">{t.sub}</p>
        </div>
      </header>
      <section className="sec">
        <div className="wrap">
          <div className="bento">
            {PATENTS.map((p, i) => (
              <div className="bx" key={p.no}>
                <div className="num">
                  0{i + 1} — {p.no}
                </div>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
