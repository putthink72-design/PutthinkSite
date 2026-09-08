"use client";

import { AppStoreButton } from "@/components/AppStoreButton";
import { useI18n } from "@/i18n/provider";

export function CTA() {
  const { dict } = useI18n();
  const t = dict.cta;
  const h = dict.hero;

  return (
    <section className="cta" id="download">
      <div className="wrap">
        <h2>
          {t.title}
          <br />
          <span className="thin">{t.titleThin}</span>
        </h2>
        <div className="hero-cta">
          <AppStoreButton />
          <div className="free-note">
            {h.freeNoteBefore}
            <b>{h.freeNoteHighlight}</b>
            {h.freeNoteAfter}
          </div>
        </div>
      </div>
    </section>
  );
}
