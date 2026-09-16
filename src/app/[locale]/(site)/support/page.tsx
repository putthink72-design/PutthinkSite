"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@/i18n/provider";

export default function SupportPage() {
  const { dict } = useI18n();
  const t = dict.supportPage;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          email: fd.get("email"),
          message: fd.get("message"),
        }),
      });
      setStatus(res.ok ? "ok" : "err");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

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
          <form className="form-stack" onSubmit={onSubmit}>
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
            <button type="submit" className="btn-primary" disabled={status === "sending"}>
              {t.send}
            </button>
            {status === "ok" && (
              <p style={{ color: "var(--amber)", marginTop: 8 }}>Sent. We’ll get back to you.</p>
            )}
            {status === "err" && (
              <p style={{ color: "#c44", marginTop: 8 }}>Couldn’t send. Try again later.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
