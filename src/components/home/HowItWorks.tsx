"use client";

import { useI18n } from "@/i18n/provider";

const STEPS = [
  {
    numKey: "scanNum",
    titleKey: "scanTitle",
    bodyKey: "scanBody",
    image: "/batch_1.webp",
    alt: "Scan",
  },
  {
    numKey: "aimNum",
    titleKey: "aimTitle",
    bodyKey: "aimBody",
    image: "/batch_2.webp",
    alt: "Aim",
  },
  {
    numKey: "strokeNum",
    titleKey: "strokeTitle",
    bodyKey: "strokeBody",
    image: "/batch_3.webp",
    alt: "Stroke",
  },
] as const;

export function HowItWorks() {
  const { dict } = useI18n();
  const t = dict.how;

  return (
    <section className="sec" id="how">
      <div className="wrap">
        <div className="head">
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h2>
          <p className="sub">{t.sub}</p>
        </div>

        <div className="how-steps">
          {STEPS.map((step) => (
            <div className="bx how-step" key={step.numKey}>
              <div className="num">{t[step.numKey]}</div>
              <h3>{t[step.titleKey]}</h3>
              <p>{t[step.bodyKey]}</p>
              <div className="bx-viz how-step-viz">
                <img
                  className="how-step-img"
                  src={step.image}
                  alt={step.alt}
                  width={1000}
                  height={564}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
