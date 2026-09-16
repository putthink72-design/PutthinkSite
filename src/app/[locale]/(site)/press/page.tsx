"use client";

import { FormEvent, useState } from "react";
import { useI18n } from "@/i18n/provider";

export default function PressPage() {
  const { dict } = useI18n();
  const t = dict.pressPage;
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/press-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          organization: fd.get("organization"),
        }),
      });
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <>
      <header className="page-hero light">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.title}</h1>
          <p className="sub" style={{ color: "var(--g-2)" }}>
            {t.sub}
          </p>
        </div>
      </header>
      <section className="sec light" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="bento" style={{ marginBottom: 48 }}>
            <div
              className="bx full"
              style={{
                background: "#fff",
                borderColor: "var(--line-l)",
                color: "var(--ink)",
              }}
            >
              <div className="num" style={{ color: "var(--g-2)" }}>
                {t.releaseLabel}
              </div>
              <h3 style={{ color: "var(--ink)" }}>{t.releaseTitle}</h3>
              <p style={{ color: "var(--g-2)" }}>{t.releaseBody}</p>
            </div>
          </div>

          <div className="head">
            <h2 style={{ fontSize: "clamp(24px,3vw,36px)" }}>{t.kitTitle}</h2>
            <p className="sub">{t.kitSub}</p>
          </div>
          <form className="form-stack" onSubmit={onSubmit}>
            <div>
              <label htmlFor="press-email">{t.email}</label>
              <input id="press-email" name="email" type="email" required aria-label={t.email} />
            </div>
            <div>
              <label htmlFor="org">{t.org}</label>
              <input id="org" name="organization" type="text" aria-label={t.org} />
            </div>
            <button type="submit" className="btn-primary">
              {t.submit}
            </button>
            {status === "ok" && (
              <p style={{ color: "var(--amber)", marginTop: 8 }}>Request recorded.</p>
            )}
            {status === "err" && (
              <p style={{ color: "#c44", marginTop: 8 }}>Couldn’t submit. Try again later.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
