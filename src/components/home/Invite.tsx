"use client";

import { useI18n } from "@/i18n/provider";

export function Invite() {
  const { dict } = useI18n();
  const t = dict.invite;

  return (
    <section className="sec light">
      <div className="wrap invite">
        <div>
          <div className="eyebrow">{t.eyebrow}</div>
          <h2>
            {t.title}
            <br />
            <span className="thin">{t.titleThin}</span>
          </h2>
          <p className="sub">{t.sub}</p>
        </div>
        <div className="iv-cols">
          <div className="iv-card hi">
            <div className="k">{t.senderK}</div>
            <h3>{t.senderTitle}</h3>
            <div className="cap">{t.senderCap}</div>
            <ul>
              <li>
                <b>{t.senderB1}</b>
                {t.senderP1}
              </li>
              <li>
                <b>{t.senderB2}</b>
                {t.senderP2}
              </li>
              <li>
                <b>{t.senderB3}</b>
                {t.senderP3}
              </li>
            </ul>
          </div>
          <div className="iv-card">
            <div className="k">{t.receiverK}</div>
            <h3>{t.receiverTitle}</h3>
            <div className="cap">{t.receiverCap}</div>
            <ul>
              <li>
                <b>{t.receiverB1}</b>
                {t.receiverP1}
              </li>
              <li>
                <b>{t.receiverB2}</b>
                {t.receiverP2}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
