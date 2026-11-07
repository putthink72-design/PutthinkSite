/** Real App Store product URL — set NEXT_PUBLIC_APP_STORE_URL when the listing is live. */
export const APP_STORE_LISTING_URL =
  (process.env.NEXT_PUBLIC_APP_STORE_URL ?? "").trim();

export const IS_APP_STORE_LIVE = APP_STORE_LISTING_URL.length > 0;

/**
 * Before launch, do not send users to a misleading App Store search.
 * Point to Support; swap automatically when NEXT_PUBLIC_APP_STORE_URL is set.
 */
export const APP_STORE_URL = IS_APP_STORE_LIVE
  ? APP_STORE_LISTING_URL
  : "/support";

export const SITE_NAME = "펏띵 Putthink";
export const SITE_TAGLINE = "그린을 읽어주는 AR 퍼팅 코치";
export const SITE_DESCRIPTION =
  "아이폰 라이다로 그린의 다중 경사를 스캔하고, AR로 퍼팅 방향과 세기를 안내합니다. 계정당 평생 9회 무료.";

/** Official field-test numbers — do not change */
export const FIELD_TEST = {
  totalPutts: 30,
  holed: 14,
  conceded: 16,
} as const;

/**
 * Marketing / deep-link reference prices (USD list).
 * In-app UI must show StoreKit localized prices only — never hardcode these in the app.
 * Site copy may show these as list prices; actual App Store price can vary by country.
 */
export const PRICING = {
  /** Lifetime free runs per Apple ID account */
  freeRuns: 9,
  /** Extra free runs for the invitee (policy: none) */
  inviteeBonusRuns: 0,
  /** Bonus runs credited to the inviter when invitee completes first scan result */
  inviterCreditRuns: 9,
  monthly: 7.99,
  quarterly: 19.99,
  semiAnnual: 34.99,
  annual: 59.99,
} as const;
