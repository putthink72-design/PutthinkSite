"use client";

import { useI18n } from "@/i18n/provider";

export default function SupportPage() {
  const { dict } = useI18n();
  const t = dict.supportPage;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.title}</h1>
          <p className="sub">{t.sub}</p>
        </div>
      </header>
      <section className="sec">
        <div className="wrap">
          <div className="head">
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)" }}>{t.faqTitle}</h2>
          </div>
          <div className="faq">
            {t.faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="sec light" id="contact">
        <div className="wrap">
          <div className="head">
            <div className="eyebrow">{t.contactEyebrow}</div>
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)" }}>{t.contactTitle}</h2>
            <p className="sub">{t.contactSub}</p>
          </div>
          <form className="form-stack" action="#" method="post">
            <div>
              <label htmlFor="name">{t.name}</label>
              <input id="name" name="name" type="text" required aria-label={t.name} />
            </div>
            <div>
              <label htmlFor="email">{t.email}</label>
              <input id="email" name="email" type="email" required aria-label={t.email} />
            </div>
            <div>
              <label htmlFor="message">{t.message}</label>
              <textarea id="message" name="message" required aria-label={t.message} />
            </div>
            <button type="submit" className="btn-primary">
              {t.send}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
