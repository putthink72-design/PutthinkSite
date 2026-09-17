"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleLink } from "@/components/LocaleLink";
import type { DataRoomRequestRow } from "@/lib/data-room";

export default function DataRoomAdminClient() {
  const [secret, setSecret] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [rows, setRows] = useState<DataRoomRequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastLink, setLastLink] = useState<string | null>(null);
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);

  const load = useCallback(async (status: string) => {
    setError(null);
    const res = await fetch(
      `/api/data-room/review?status=${encodeURIComponent(status)}`,
      { credentials: "include" },
    );
    if (res.status === 401) {
      setUnlocked(false);
      setError(null);
      return;
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "목록을 불러오지 못했습니다.");
      return;
    }
    const body = await res.json();
    setRows(body.requests ?? []);
    setUnlocked(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/data-room/admin-session", {
        credentials: "include",
      });
      if (cancelled) return;
      if (res.ok) {
        setUnlocked(true);
      }
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!unlocked || checking) return;
    void load(statusFilter);
  }, [unlocked, checking, statusFilter, load]);

  async function onUnlock(e: FormEvent) {
    e.preventDefault();
    const value = secret.trim();
    if (!value) return;
    setError(null);
    const res = await fetch("/api/data-room/admin-session", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: value }),
    });
            if (!res.ok) {
      setError("시크릿 또는 비밀번호가 올바르지 않습니다.");
      setUnlocked(false);
      return;
    }
    setSecret("");
    setUnlocked(true);
  }

  async function onLock() {
    await fetch("/api/data-room/admin-session", {
      method: "DELETE",
      credentials: "include",
    });
    setUnlocked(false);
    setRows([]);
    setLastLink(null);
    setLastNote(null);
  }

  async function review(
    id: string,
    action: "approve" | "deny" | "resend",
  ) {
    setBusyId(id);
    setError(null);
    setLastLink(null);
    setLastNote(null);
    try {
      const res = await fetch("/api/data-room/review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          action,
          resend: action === "resend",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.message ?? body.error ?? "처리 실패");
        if (body.actionLink) setLastLink(body.actionLink);
        if (res.status === 401) setUnlocked(false);
      } else if (action !== "deny") {
        if (body.actionLink) setLastLink(body.actionLink);
        if (body.via === "manual" || body.emailWarning) {
          setLastNote(
            body.emailWarning
              ? `${body.emailWarning}`
              : "아래 매직링크를 복사해 요청자에게 직접 보내세요.",
          );
        } else if (body.via === "supabase") {
          setLastNote(
            "Supabase 메일 발송을 요청했습니다. 스팸함을 확인하고, 안 오면 아래 링크를 복사해 보내세요.",
          );
        } else if (body.via === "resend") {
          setLastNote(
            "Resend로 매직링크 메일을 보냈습니다. 아래 링크도 백업으로 복사할 수 있습니다.",
          );
        }
      }
      await load(statusFilter);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="gate">
      <div className="gate-card" style={{ maxWidth: 720 }}>
        <div
          className="gate-brand"
          style={{
            justifyContent: "space-between",
            maxWidth: 720,
            margin: "0 auto 28px",
            width: "100%",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
            <span className="dot" />
            Data Room Admin
          </span>
          <LanguageSwitcher />
        </div>

        <div className="gate-box" style={{ maxWidth: 720 }}>
          <div className="gate-eyebrow">INTERNAL</div>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>접근 요청 검토</h1>
          <p className="lede" style={{ marginBottom: 22 }}>
            승인하면 요청자 이메일로 일회용 매직링크가 발송됩니다. 시크릿 또는
            비밀번호로 잠금 해제하면 이 브라우저에서 30일간 유지됩니다.
          </p>

          {checking ? (
            <p style={{ color: "var(--dr-text-2)", fontSize: 14 }}>확인 중…</p>
          ) : !unlocked ? (
            <form onSubmit={(e) => void onUnlock(e)}>
              <div className="field">
                <label htmlFor="dr-admin-secret">시크릿 또는 비밀번호</label>
                <input
                  id="dr-admin-secret"
                  type="password"
                  autoComplete="current-password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p style={{ color: "#b42318", fontSize: 13, marginBottom: 12 }}>
                  {error}
                </p>
              )}
              <button type="submit" className="gate-submit">
                잠금 해제
              </button>
            </form>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 18,
                  alignItems: "center",
                }}
              >
                {(["pending", "approved", "denied", "all"] as const).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatusFilter(s)}
                      style={{
                        border:
                          statusFilter === s
                            ? "1px solid var(--dr-ink)"
                            : "1px solid var(--dr-line)",
                        background:
                          statusFilter === s ? "var(--dr-ink)" : "transparent",
                        color:
                          statusFilter === s ? "var(--dr-bg)" : "var(--dr-ink)",
                        borderRadius: 999,
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ),
                )}
                <LocaleLink
                  href="/data-room/request"
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    borderBottom: "1px solid var(--dr-line)",
                  }}
                >
                  요청 폼 →
                </LocaleLink>
                <button
                  type="button"
                  onClick={() => void onLock()}
                  style={{
                    border: "1px solid var(--dr-line)",
                    background: "transparent",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  잠금
                </button>
              </div>

              {error && (
                <p style={{ color: "#b42318", fontSize: 13, marginBottom: 12 }}>
                  {error}
                </p>
              )}

              {(lastNote || lastLink) && (
                <div
                  style={{
                    border: "1px solid var(--dr-line)",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 16,
                    background: "var(--dr-panel-2, #fbfbf9)",
                  }}
                >
                  {lastNote && (
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--dr-text-2)",
                        margin: "0 0 10px",
                        lineHeight: 1.6,
                      }}
                    >
                      {lastNote}
                    </p>
                  )}
                  {lastLink && (
                    <>
                      <label
                        htmlFor="dr-magic-link"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        매직링크 (복사해서 직접 전달 가능)
                      </label>
                      <textarea
                        id="dr-magic-link"
                        readOnly
                        value={lastLink}
                        rows={3}
                        style={{
                          width: "100%",
                          marginTop: 6,
                          fontSize: 12,
                          fontFamily: "var(--mono)",
                          lineHeight: 1.5,
                        }}
                        onFocus={(e) => e.currentTarget.select()}
                      />
                      <button
                        type="button"
                        className="gate-submit"
                        style={{
                          width: "auto",
                          padding: "8px 14px",
                          marginTop: 8,
                        }}
                        onClick={() =>
                          void navigator.clipboard.writeText(lastLink)
                        }
                      >
                        링크 복사
                      </button>
                    </>
                  )}
                </div>
              )}

              {rows.length === 0 ? (
                <p style={{ color: "var(--dr-text-2)", fontSize: 14 }}>
                  표시할 요청이 없습니다.
                </p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {rows.map((r) => (
                    <li
                      key={r.id}
                      style={{
                        border: "1px solid var(--dr-line)",
                        borderRadius: 14,
                        padding: 16,
                        marginBottom: 12,
                        background: "var(--dr-panel, #fff)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700 }}>{r.organization}</div>
                          <div
                            style={{
                              fontSize: 13,
                              color: "var(--dr-text-2)",
                              marginTop: 4,
                            }}
                          >
                            {r.email}
                            {r.phone ? ` · ${r.phone}` : ""}
                            {r.role ? ` · ${r.role}` : ""}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "var(--mono)",
                            color: "var(--dr-text-2)",
                            textAlign: "right",
                          }}
                        >
                          {r.status}
                          <br />
                          {new Date(r.created_at).toLocaleString()}
                        </div>
                      </div>
                      {r.message && (
                        <p
                          style={{
                            fontSize: 13,
                            color: "var(--dr-text-2)",
                            margin: "10px 0 0",
                            lineHeight: 1.6,
                          }}
                        >
                          {r.message}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          marginTop: 14,
                          flexWrap: "wrap",
                        }}
                      >
                        {r.status === "pending" && (
                          <>
                            <button
                              type="button"
                              className="gate-submit"
                              style={{ width: "auto", padding: "8px 14px" }}
                              disabled={busyId === r.id}
                              onClick={() => void review(r.id, "approve")}
                            >
                              승인 + 매직링크
                            </button>
                            <button
                              type="button"
                              disabled={busyId === r.id}
                              onClick={() => void review(r.id, "deny")}
                              style={{
                                border: "1px solid var(--dr-line)",
                                background: "transparent",
                                borderRadius: 999,
                                padding: "8px 14px",
                                fontSize: 13,
                                cursor: "pointer",
                              }}
                            >
                              거절
                            </button>
                          </>
                        )}
                        {r.status === "approved" && (
                          <button
                            type="button"
                            className="gate-submit"
                            style={{ width: "auto", padding: "8px 14px" }}
                            disabled={busyId === r.id}
                            onClick={() => void review(r.id, "resend")}
                          >
                            매직링크 재발송
                            {r.magic_link_sent_at
                              ? ` · 최근 ${new Date(r.magic_link_sent_at).toLocaleDateString()}`
                              : ""}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
