"use client";

import { useI18n } from "@/i18n/provider";
import { useAuth } from "./AuthProvider";
import { useState } from "react";

export function LoginModal() {
  const { dict } = useI18n();
  const t = dict.auth;
  const { loginOpen, closeLogin, signInWith, configured } = useAuth();
  const [busy, setBusy] = useState<"apple" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!loginOpen) return null;

  async function onProvider(provider: "apple" | "google") {
    setError(null);
    setBusy(provider);
    try {
      await signInWith(provider);
    } catch {
      setError(t.error);
      setBusy(null);
    }
  }

  return (
    <div
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeLogin();
      }}
    >
      <div className="auth-modal-panel">
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeLogin}
          aria-label={t.close}
        >
          ×
        </button>
        <h2 id="auth-modal-title">{t.title}</h2>
        <p className="auth-modal-sub">{t.sub}</p>
        {!configured ? (
          <p className="auth-modal-err">{t.notConfigured}</p>
        ) : (
          <div className="auth-modal-actions">
            <button
              type="button"
              className="auth-btn apple"
              disabled={!!busy}
              onClick={() => onProvider("apple")}
            >
              {busy === "apple" ? t.loading : t.apple}
            </button>
            <button
              type="button"
              className="auth-btn google"
              disabled={!!busy}
              onClick={() => onProvider("google")}
            >
              {busy === "google" ? t.loading : t.google}
            </button>
          </div>
        )}
        {error ? <p className="auth-modal-err">{error}</p> : null}
        <p className="auth-modal-note">{t.note}</p>
      </div>
    </div>
  );
}
