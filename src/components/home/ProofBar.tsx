"use client";

import { useI18n } from "@/i18n/provider";

export function ProofBar() {
  const { dict } = useI18n();
  const t = dict.proof;

  return (
    <section className="proof">
      <div className="wrap">
        <div className="proof-in">
          <div className="pcell">
            <div className="v mono">
              {t.puttsValue}
              <em>{t.puttsUnit}</em>
            </div>
            <div className="k">{t.puttsLabel}</div>
          </div>
          <div className="pcell">
            <div className="v mono">
              {t.holedValue}
              <em>{t.holedUnit}</em>
            </div>
            <div className="k">{t.holedLabel}</div>
          </div>
          <div className="pcell">
            <div className="v mono">
              {t.patentsValue}
              <em>{t.patentsUnit}</em>
            </div>
            <div className="k">{t.patentsLabel}</div>
          </div>
          <div className="pcell">
            <div className="v mono">
              {t.countriesValue}
              <em>{t.countriesUnit}</em>
            </div>
            <div className="k">{t.countriesLabel}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
