import { APP_STORE_URL, IS_APP_STORE_LIVE, PRICING, SITE_NAME } from "@/lib/constants";
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
    desc: (free: number, credit: number) =>
      `초대 코드로 Putthink에 가입하면 계정당 평생 무료 ${free}회. 친구가 첫 스캔을 완료하면 초대자에게 +${credit}회.`,
    ogTitle: "Putthink 초대",
    ogDesc: (free: number) => `계정당 평생 무료 ${free}회 · 초대 코드로 시작`,
    h1a: "친구가 Putthink로",
    h1b: "초대했어요",
    body: (free: number, credit: number) =>
      `초대 코드가 클립보드에 복사됩니다. Sign in with Apple로 가입하면 계정당 평생 무료 ${free}회를 쓸 수 있습니다(초대받아도 추가 횟수는 없습니다). 첫 스캔 직전에 로그인하면서 이 코드를 입력해 주세요. 당신이 첫 스캔 결과를 완료하면 초대한 친구에게 +${credit}회가 적립됩니다.`,
    invalid: "초대 링크가 올바르지 않습니다. 출시 후 App Store에서 Putthink를 받아 주세요.",
    cta: "출시 예정 · 지원 보기",
    ctaLive: "App Store에서 받기",
    foot: "이미 앱이 있다면 로그인·설정 화면에서 이 초대 코드를 직접 입력할 수 있습니다. 출시 후 App Store에서 Putthink를 설치해 주세요.",
  },
  en: {
    title: (name: string) => `Invite · ${name}`,
    desc: (free: number, credit: number) =>
      `Join Putthink with an invite code for ${free} lifetime free runs per account. Completing your first scan credits +${credit} to your friend.`,
    ogTitle: "Putthink invite",
    ogDesc: (free: number) => `${free} lifetime free runs per account · start with an invite code`,
    h1a: "A friend invited you",
    h1b: "to Putthink",
    body: (free: number, credit: number) =>
      `Your invite code is copied to the clipboard. Sign in with Apple for ${free} lifetime free runs per account—invitees get no extra free runs. Enter this code on the sign-in screen (just before your first scan) or in Settings. When you complete your first scan result, your friend earns +${credit} bonus runs.`,
    invalid: "This invite link isn’t valid. Get Putthink on the App Store when it’s available.",
    cta: "Coming soon · Support",
    ctaLive: "Get on the App Store",
    foot: "If the app is already installed, enter this invite code on the sign-in or Settings screen. Install Putthink from the App Store when it’s available.",
  },
  ja: {
    title: (name: string) => `招待 · ${name}`,
    desc: (free: number, credit: number) =>
      `招待コードでPutthinkに登録するとアカウントあたり生涯無料${free}回。最初のスキャン完了で招待者に+${credit}回。`,
    ogTitle: "Putthink招待",
    ogDesc: (free: number) => `アカウントあたり生涯無料${free}回 · 招待コードでスタート`,
    h1a: "友だちからPutthinkに",
    h1b: "招待されました",
    body: (free: number, credit: number) =>
      `招待コードがクリップボードにコピーされます。Sign in with Appleで登録するとアカウントあたり生涯無料${free}回を使えます（招待されても追加の無料回数はありません）。最初のスキャン直前のログイン画面か設定でこのコードを入力してください。あなたが最初のスキャン結果を完了すると、招待した友だちに+${credit}回が付与されます。`,
    invalid: "招待リンクが正しくありません。公開後にApp StoreでPutthinkを入手してください。",
    cta: "近日公開 · サポート",
    ctaLive: "App Storeで入手",
    foot: "すでにアプリがある場合は、ログイン画面または設定でこの招待コードを入力できます。公開後にApp StoreでPutthinkをインストールしてください。",
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const h = await headers();
  const lang = langFromHeaders(h.get("accept-language"));
  const t = copy[lang];
  return {
    title: t.title(SITE_NAME),
    description: t.desc(PRICING.freeRuns, PRICING.inviterCreditRuns),
    robots: { index: false, follow: false },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDesc(PRICING.freeRuns),
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
            t.body(PRICING.freeRuns, PRICING.inviterCreditRuns)
          ) : (
            t.invalid
          )}
        </p>

        {valid && (
          <InviteLandingClient inviteUrl={inviteUrl} code={normalized} />
        )}

        <a
          href={IS_APP_STORE_LIVE ? APP_STORE_URL : `/${lang}/support`}
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
          {IS_APP_STORE_LIVE ? t.ctaLive : t.cta}
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
