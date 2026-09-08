import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  ko: () => import("@/i18n/dictionaries/ko"),
  en: () => import("@/i18n/dictionaries/en"),
  ja: () => import("@/i18n/dictionaries/ja"),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const mod = await dictionaries[locale]();
  return mod.default;
}
