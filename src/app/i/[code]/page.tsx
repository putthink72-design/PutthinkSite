import { APP_STORE_URL, PRICING, SITE_NAME } from "@/lib/constants";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { InviteLandingClient } from "./InviteLandingClient";

type Props = { params: Promise<{ code: string }> };

function langFromHeaders(accept: string | null): "ko" | "en" | "ja" {
  const raw = (accept ?? "").toLowerCase();
  if (raw.includes("ko")) return "ko";
  if (raw.includes("ja")) return "ja";
  return "en";
}

const copy = {
  ko: {
    title: (name: string) => `친구 초대 · ${name}`,
    desc: (n: number) => `초대 링크로 Putthink를 설치하면 무료 실행 ${n}회.`,
    ogTitle: "Putthink 초대",
    ogDesc: (n: number) => `이 링크로 설치하면 무료 ${n}회`,
    h1a: "친구가 Putthink로",
    h1b: "초대했어요",
    body: (invite: number, free: number) =>
      `이 링크로 설치하면 무료 실행 ${invite}회(일반 ${free}회보다 많음). 초대 링크가 클립보드에 복사됩니다. 설치 후 앱에서「초대 링크로 무료 6회 받기」를 누르거나, 이 링크를 다시 열어 주세요.`,
    invalid: "초대 링크가 올바르지 않습니다. App Store에서 Putthink를 받아 주세요.",
    cta: "App Store에서 받기",
    foot: "이미 앱이 있다면 이 초대 링크를 다시 탭하면 앱으로 바로 열려 적용됩니다. 새로 설치했다면 설정 → 무료 실행에서 초대를 적용해 주세요.",
  },
  en: {
    title: (name: string) => `Invite · ${name}`,
    desc: (n: number) => `Install Putthink via invite for ${n} free runs.`,
    ogTitle: "Putthink invite",
    ogDesc: (n: number) => `Install via this link for ${n} free runs`,
    h1a: "A friend invited you",
    h1b: "to Putthink",
    body: (invite: number, free: number) =>
      `Install via this link for ${invite} free runs (normally ${free}). The invite link is copied to your clipboard. After install, tap “Get 6 free tries via invite link” in the app, or reopen this link.`,
    invalid: "This invite link isn’t valid. Get Putthink on the App Store.",
    cta: "Get on the App Store",
    foot: "If the app is already installed, tap this invite link again to open Putthink. After a fresh install, apply the invite under Settings → Free runs.",
  },
  ja: {
    title: (name: string) => `招待 · ${name}`,
    desc: (n: number) => `招待リンクから入れると無料実行${n}回。`,
    ogTitle: "Putthink招待",
    ogDesc: (n: number) => `このリンクから入れると無料${n}回`,
    h1a: "友だちからPutthinkに",
    h1b: "招待されました",
    body: (invite: number, free: number) =>
      `このリンクから入れると無料実行${invite}回（通常${free}回）。招待リンクがクリップボードにコピーされます。インストール後、アプリで「招待リンクで無料6回を受け取る」を押すか、このリンクを再度開いてください。`,
    invalid: "招待リンクが正しくありません。App StoreでPutthinkを入手してください。",
    cta: "App Storeで入手",
    foot: "すでにアプリがある場合はこの招待リンクを再度タップするとアプリが開きます。新規インストール後は設定→無料実行から招待を適用してください。",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const h = await headers();
  const lang = langFromHeaders(h.get("accept-language"));
  const t = copy[lang];
  return {
    title: t.title(SITE_NAME),
    description: t.desc(PRICING.inviteFreeRuns),
    robots: { index: false, follow: false },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDesc(PRICING.inviteFreeRuns),
      url: `https://putthink.com/i/${code}`,
    },
  };
}

export default async function InviteLandingPage({ params }: Props) {
  const { code } = await params;
  const h = await headers();
  const lang = langFromHeaders(h.get("accept-language"));
  const t = copy[lang];
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
          {t.h1a}
          <br />
          {t.h1b}
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
            t.body(PRICING.inviteFreeRuns, PRICING.freeRuns)
          ) : (
            t.invalid
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
          {t.cta}
        </a>

        <p
          style={{
            marginTop: 28,
            fontSize: 12,
            color: "rgba(242,245,243,0.45)",
            lineHeight: 1.5,
          }}
        >
          {t.foot}
        </p>
      </div>
    </main>
  );
}
