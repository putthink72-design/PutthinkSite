"use client";

import { HowItWorks } from "@/components/home/HowItWorks";
import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";

export default function HowItWorksPage() {
  const { dict } = useI18n();
  const t = dict.howPage;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{dict.how.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h1>
          <p className="sub">
            {t.subBefore}
            <LocaleLink href="/technology" style={{ borderBottom: "1px solid var(--line-d)" }}>
              {t.subLink}
            </LocaleLink>
          </p>
        </div>
      </header>
      <HowItWorks />
    </>
  );
}
