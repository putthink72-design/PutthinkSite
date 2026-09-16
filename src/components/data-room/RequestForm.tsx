"use client";

import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleLink } from "@/components/LocaleLink";
import { useI18n } from "@/i18n/provider";

export function RequestForm() {
  const { dict } = useI18n();
  const t = dict.dataRoom;
  const [done, setDone] = useState(false);

  return (
    <div className="gate">
      <div className="gate-card">
        <div className="gate-brand" style={{ justifyContent: "space-between", maxWidth: 460, margin: "0 auto 34px", width: "100%" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span className="dot" />
            Putthink
          </span>
          <LanguageSwitcher />
        </div>
        <div className="gate-box">
          <div className="gate-eyebrow">{t.requestEyebrow}</div>
          <h1 style={{ whiteSpace: "pre-line" }}>{t.requestTitle}</h1>
          <p className="lede">{t.requestLede}</p>

          {!done ? (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  try {
                    const res = await fetch("/api/data-room-request", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email: fd.get("email"),
                        organization: fd.get("organization"),
                        role: fd.get("role"),
                        message: fd.get("message"),
                      }),
                    });
                    if (res.ok) setDone(true);
                  } catch {
                    /* keep form */
                  }
                }}
              >
                <div className="field">
                  <label htmlFor="dr-email">{t.email}</label>
                  <input
                    id="dr-email"
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="dr-org">{t.org}</label>
                  <input id="dr-org" type="text" name="organization" required />
                </div>
                <div className="field">
                  <label htmlFor="dr-role">{t.role}</label>
                  <select id="dr-role" name="role" defaultValue="">
                    <option value="" disabled>
                      {t.rolePlaceholder}
                    </option>
                    <option>{t.roleVc}</option>
                    <option>{t.roleCorp}</option>
                    <option>{t.roleAdvisor}</option>
                    <option>{t.roleOther}</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="dr-msg">{t.message}</label>
                  <textarea
                    id="dr-msg"
                    name="message"
                    placeholder={t.messagePlaceholder}
                  />
                </div>
                <button type="submit" className="gate-submit">
                  {t.submit}
                </button>
              </form>
              <p className="gate-fine">{t.fine}</p>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "var(--dr-up-soft)",
                  color: "var(--dr-up)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 800,
                  margin: "0 auto 16px",
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  marginBottom: 8,
                  color: "var(--dr-ink)",
                }}
              >
                {t.successTitle}
              </h2>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--dr-text-2)",
                  lineHeight: 1.75,
                  marginBottom: 22,
                }}
              >
                {t.successBody}
              </p>
              <LocaleLink
                href="/data-room"
                className="gate-submit"
                style={{
                  display: "block",
                  textDecoration: "none",
                  boxSizing: "border-box",
                  textAlign: "center",
                }}
              >
                {t.demoPreview}
              </LocaleLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
