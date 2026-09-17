"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Browser-side magic-link confirm.
 * Verifying in the browser writes Supabase auth cookies on www.putthink.com
 * more reliably than a server redirect Set-Cookie.
 */
export default function ConfirmClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [message, setMessage] = useState("로그인 처리 중…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token_hash = search.get("token_hash");
      const typeRaw = (search.get("type") ?? "magiclink") as EmailOtpType;
      const nextRaw = search.get("next") ?? "/ko/data-room";
      const next = nextRaw.startsWith("/") ? nextRaw : `/${nextRaw}`;

      if (!token_hash) {
        setMessage("링크가 올바르지 않습니다.");
        router.replace(
          "/ko/data-room/request?need=login&auth_error=missing_token",
        );
        return;
      }

      try {
        const supabase = createClient();
        const tryTypes: EmailOtpType[] = [typeRaw, "magiclink", "email"];
        const unique = [...new Set(tryTypes)];

        let lastError: string | null = null;
        for (const type of unique) {
          const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
          });
          if (!error) {
            if (cancelled) return;
            setMessage("로그인되었습니다. Data Room으로 이동합니다…");
            router.replace(next);
            router.refresh();
            return;
          }
          lastError = error.message;
        }

        if (cancelled) return;
        const reason = encodeURIComponent(lastError ?? "verify_failed");
        router.replace(
          `/ko/data-room/request?need=login&auth_error=${reason}`,
        );
      } catch (e) {
        if (cancelled) return;
        const reason = encodeURIComponent(
          e instanceof Error ? e.message : "confirm_failed",
        );
        router.replace(
          `/ko/data-room/request?need=login&auth_error=${reason}`,
        );
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, search]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Pretendard, system-ui, sans-serif",
        color: "#1a1a1a",
        padding: 24,
        background: "#f7f7f4",
      }}
    >
      <p style={{ fontSize: 15, lineHeight: 1.6 }}>{message}</p>
    </div>
  );
}
