"use client";

import { useEffect, useMemo, useState } from "react";

export function InviteLandingClient({
  inviteUrl,
  code,
}: {
  inviteUrl: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const copiedLabel = useMemo(() => {
    const lang =
      typeof navigator !== "undefined"
        ? navigator.language.slice(0, 2).toLowerCase()
        : "en";
    if (lang === "ko") return `초대 링크가 클립보드에 복사됨 · ${code}`;
    if (lang === "ja") return `招待リンクをコピーしました · ${code}`;
    return `Invite link copied · ${code}`;
  }, [code]);
  const idleLabel = useMemo(() => {
    const lang =
      typeof navigator !== "undefined"
        ? navigator.language.slice(0, 2).toLowerCase()
        : "en";
    if (lang === "ko") return `초대 코드 · ${code}`;
    if (lang === "ja") return `招待コード · ${code}`;
    return `Invite code · ${code}`;
  }, [code]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await navigator.clipboard.writeText(inviteUrl);
        if (!cancelled) setCopied(true);
      } catch {
        try {
          await navigator.clipboard.writeText(code);
          if (!cancelled) setCopied(true);
        } catch {
          /* ignore — user can still open App Store */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [inviteUrl, code]);

  return (
    <p
      style={{
        fontSize: 13,
        color: copied ? "#ffb020" : "rgba(242,245,243,0.55)",
        margin: "0 0 8px",
      }}
    >
      {copied ? copiedLabel : idleLabel}
    </p>
  );
}
