import type { Locale } from "@/i18n/config";
import { PRIVACY_KO, TERMS_KO } from "@/lib/legal";
import { PRIVACY_EN, TERMS_EN } from "@/i18n/legal/en";
import { PRIVACY_JA, TERMS_JA } from "@/i18n/legal/ja";

export function getPrivacy(locale: Locale): string {
  if (locale === "en") return PRIVACY_EN;
  if (locale === "ja") return PRIVACY_JA;
  return PRIVACY_KO;
}

export function getTerms(locale: Locale): string {
  if (locale === "en") return TERMS_EN;
  if (locale === "ja") return TERMS_JA;
  return TERMS_KO;
}
