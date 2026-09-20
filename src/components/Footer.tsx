"use client";

import { Logo } from "./AppStoreButton";
import { LocaleLink } from "./LocaleLink";
import { useI18n } from "@/i18n/provider";

export function Footer() {
  const { dict, href } = useI18n();
  const t = dict.footer;

  return (
    <footer className="ft" id="support">
      <div className="wrap">
        <div className="ft-in">
          <div className="ft-brand">
            <Logo href={href("/")} />
            <p
              style={{
                fontSize: 13,
                color: "var(--g-2)",
                maxWidth: "24ch",
                marginTop: 14,
              }}
            >
              {t.tagline}
            </p>
          </div>
          <div className="ft-col">
            <h5>{t.product}</h5>
            <ul>
              <li>
                <LocaleLink href="/how-it-works">{t.how}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/pricing">{t.pricing}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/technology">{t.technology}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/devices">{t.devices}</LocaleLink>
              </li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>{t.community}</h5>
            <ul>
              <li>
                <LocaleLink href="/showcase">{t.showcase}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/hof">{t.hof}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/guidelines">{t.guidelines}</LocaleLink>
              </li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>{t.support}</h5>
            <ul>
              <li>
                <LocaleLink href="/support">{t.faq}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/support#contact">{t.contact}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms">{t.terms}</LocaleLink>
              </li>
              <li>
                <LocaleLink href="/privacy">{t.privacy}</LocaleLink>
              </li>
            </ul>
          </div>
          <div className="ft-col">
            <h5>{t.company}</h5>
            <ul>
              <li>
                <a href="https://nasem.kr" target="_blank" rel="noopener noreferrer">
                  {t.companyName}
                </a>
              </li>
              <li>
                <LocaleLink href="/press">{t.press}</LocaleLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="ft-b">
          <span>{t.copyright}</span>
          <span>
            {t.dataRoomHintBefore}
            <LocaleLink href="/data-room/request">Data Room</LocaleLink>
            {t.dataRoomHintAfter}
          </span>
        </div>
      </div>
    </footer>
  );
}
