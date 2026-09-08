"use client";

import { APP_STORE_URL } from "@/lib/constants";
import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";

export function PricingSection() {
  const { dict } = useI18n();
  const t = dict.pricing;

  return (
    <section className="sec" id="pricing">
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

        <div className="plans">
          <div className="plan">
            <div className="tag">{t.freeTag}</div>
            <div className="amt">
              {t.freeAmt}
              <em>{t.freeUnit}</em>
            </div>
            <div className="per">{t.freePer}</div>
            <ul>
              <li>{t.freeLi1}</li>
              <li>{t.freeLi2}</li>
              <li>{t.freeLi3}</li>
            </ul>
            <a className="go" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              {t.freeCta}
            </a>
          </div>

          <div className="plan best">
            <span className="badge-top">{t.bestBadge}</span>
            <div className="tag">{t.annualTag}</div>
            <div className="amt">
              {t.annualAmt}
              <em>{t.annualUnit}</em>
            </div>
            <div className="per">{t.annualPer}</div>
            <ul>
              <li>{t.annualLi1}</li>
              <li>{t.annualLi2}</li>
              <li>{t.annualLi3}</li>
            </ul>
            <a className="go" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
              {t.annualCta}
            </a>
          </div>

          <div className="plan">
            <div className="tag">{t.flexTag}</div>
            <div className="amt">
              {t.flexAmt}
              <em>{t.flexUnit}</em>
            </div>
            <div className="per">{t.flexPer}</div>
            <ul>
              <li>{t.flexLi1}</li>
              <li>{t.flexLi2}</li>
              <li>{t.flexLi3}</li>
            </ul>
            <LocaleLink className="go" href="/pricing">
              {t.flexCta}
            </LocaleLink>
          </div>
        </div>
      </div>
    </section>
  );
}
