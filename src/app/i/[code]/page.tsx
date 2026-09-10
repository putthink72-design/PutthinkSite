import { APP_STORE_URL, PRICING, SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { InviteLandingClient } from "./InviteLandingClient";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `친구 초대 · ${SITE_NAME}`,
    description: `초대 링크로 Putthink를 설치하면 무료 실행 ${PRICING.inviteFreeRuns}회.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: "Putthink 초대",
      description: `이 링크로 설치하면 무료 ${PRICING.inviteFreeRuns}회`,
      url: `https://putthink.com/i/${code}`,
    },
  };
}

export default async function InviteLandingPage({ params }: Props) {
  const { code } = await params;
  const normalized = code.trim();
  const valid = /^[0-9A-Za-z]{8}$/.test(normalized);
  const inviteUrl = valid
    ? `https://putthink.com/i/${normalized}`
    : "https://putthink.com";

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        background: "#0a0e0c",
        color: "#f2f5f3",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
      }}
    >
      <div style={{ maxWidth: 420, width: "100%", textAlign: "center" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            fontWeight: 700,
            color: "#ffb020",
            marginBottom: 12,
          }}
        >
          PUTTHINK INVITE
        </p>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: "0 0 12px",
            lineHeight: 1.2,
          }}
        >
          친구가 Putthink로
          <br />
          초대했어요
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            color: "rgba(242,245,243,0.72)",
            margin: "0 0 28px",
          }}
        >
          {valid ? (
            <>
              이 링크로 설치하면 무료 실행{" "}
              <strong style={{ color: "#ffb020" }}>
                {PRICING.inviteFreeRuns}회
              </strong>
              (일반 {PRICING.freeRuns}회보다 많음). 초대 코드가 클립보드에
              복사됩니다 — 앱을 열면 자동으로 적용돼요.
            </>
          ) : (
            <>초대 링크가 올바르지 않습니다. App Store에서 Putthink를 받아 주세요.</>
          )}
        </p>

        {valid && (
          <InviteLandingClient inviteUrl={inviteUrl} code={normalized} />
        )}

        <a
          href={APP_STORE_URL}
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "14px 22px",
            borderRadius: 14,
            background: "linear-gradient(180deg,#ffb020,#e5960f)",
            color: "#150e02",
            fontWeight: 800,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          App Store에서 받기
        </a>

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            color: "rgba(242,245,243,0.45)",
            lineHeight: 1.5,
          }}
        >
          이미 앱이 있다면 위 링크를 다시 열거나, 설치 직후 앱을 한 번
          실행해 주세요.
        </p>
      </div>
    </main>
  );
}
