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
  "아이폰 라이다로 그린의 다중 경사를 스캔하고, AR로 퍼팅 방향과 세기를 안내합니다. 다운로드 후 3회 무료.";

/** Official field-test numbers — do not change */
export const FIELD_TEST = {
  totalPutts: 30,
  holed: 4,
  conceded: 26,
} as const;

export const PRICING = {
  freeRuns: 3,
  inviteFreeRuns: 6,
  inviterCreditRuns: 3,
  monthly: 9.99,
  quarterly: 24.99,
  semiAnnual: 44.99,
  annual: 74.99,
} as const;

export const SHOWCASE_CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "long_putt", label: "롱퍼트" },
  { id: "multi_break", label: "다중브레이크 난이도" },
  { id: "recovery", label: "극복(오르막·내리막)" },
  { id: "first_holed", label: "첫 홀인" },
] as const;

export type ShowcaseCategoryId =
  (typeof SHOWCASE_CATEGORIES)[number]["id"];
