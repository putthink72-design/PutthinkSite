"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { MOCK_SHOWCASE } from "@/lib/mock-data";

const CAT_IDS = ["all", "long_putt", "multi_break", "recovery", "first_holed"] as const;

export default function ShowcasePage() {
  const { dict } = useI18n();
  const t = dict.showcase;
  const [cat, setCat] = useState<string>("all");

  const items = useMemo(
    () =>
      cat === "all" ? MOCK_SHOWCASE : MOCK_SHOWCASE.filter((i) => i.category === cat),
    [cat],
  );

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
          <div className="cats">
            {CAT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className={`cat${cat === id ? " on" : ""}`}
                onClick={() => setCat(id)}
              >
                {t.cats[id]}
              </button>
            ))}
          </div>
          <div className="feed">
            {items.map((item) => (
              <article className="card" key={item.id}>
                <div className="card-v">
                  <div className="rank">{item.rank}</div>
                  <div className="meta">
                    {item.chips.map((ch) => (
                      <span key={ch.text} className={`chip${ch.hot ? " hot" : ""}`}>
                        {ch.text}
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
          {items.length === 0 && (
            <p style={{ color: "var(--g-2)", textAlign: "center", padding: 40 }}>{t.empty}</p>
          )}
        </div>
      </section>
    </>
  );
}
