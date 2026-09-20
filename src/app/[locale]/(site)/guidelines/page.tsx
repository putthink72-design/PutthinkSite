"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";

export default function GuidelinesPage() {
  const { dict } = useI18n();
  const t = dict.guidelinesPage;

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
          <div className="bento devices-bento">
            {t.sections.map((section) => (
              <div className="bx full" key={section.num}>
                <div className="num">{section.num}</div>
                <h3>{section.title}</h3>
                <p>{section.body}</p>
                {section.items.length > 0 ? (
                  <ul className="guideline-list">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          <p className="device-footnote">
            {t.footnoteBefore}
            <LocaleLink href="/terms">{t.termsLink}</LocaleLink>
            {t.footnoteMid}
            <LocaleLink href="/privacy">{t.privacyLink}</LocaleLink>
            {t.footnoteAfter}
            <LocaleLink href="/support">{t.supportLink}</LocaleLink>
          </p>
        </div>
      </section>
    </>
  );
}
