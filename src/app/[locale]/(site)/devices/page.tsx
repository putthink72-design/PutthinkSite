"use client";

import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";
import {
  SUPPORTED_IPADS,
  SUPPORTED_IPHONES,
} from "@/lib/supported-devices";

export default function DevicesPage() {
  const { dict } = useI18n();
  const t = dict.devicesPage;

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
            <div className="bx full">
              <div className="num">{t.iphoneNum}</div>
              <h3>{t.iphoneTitle}</h3>
              <p>{t.iphoneNote}</p>
              <ul className="device-list">
                {SUPPORTED_IPHONES.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="bx full">
              <div className="num">{t.ipadNum}</div>
              <h3>{t.ipadTitle}</h3>
              <p>{t.ipadNote}</p>
              <ul className="device-list">
                {SUPPORTED_IPADS.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
            <div className="bx full">
              <div className="num">{t.notSupportedNum}</div>
              <h3>{t.notSupportedTitle}</h3>
              <p>{t.notSupportedBody}</p>
            </div>
          </div>
          <p className="device-footnote">
            {t.footnote}{" "}
            <LocaleLink href="/support">{t.faqLink}</LocaleLink>
          </p>
        </div>
      </section>
    </>
  );
}
