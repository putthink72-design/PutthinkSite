export const locales = ["ko", "en", "ja"] as const;
export type Locale = (typeof locales)[number];

/** Matches Putthink app: follow OS, or lock to a language */
export const languageOptions = ["system", "ko", "en", "ja"] as const;
export type LanguageOption = (typeof languageOptions)[number];

export const defaultLocale: Locale = "ko";

export const LOCALE_COOKIE = "PUTTHINK_LANG";

export const localeLabels: Record<LanguageOption, Record<Locale, string>> = {
  system: { ko: "시스템", en: "System", ja: "システム" },
  ko: { ko: "한국어", en: "한국어", ja: "한국어" },
  en: { ko: "English", en: "English", ja: "English" },
  ja: { ko: "日本語", en: "日本語", ja: "日本語" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isLanguageOption(value: string): value is LanguageOption {
  return (languageOptions as readonly string[]).includes(value);
}

/** Map Accept-Language / OS preference → supported locale */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferred) {
    const primary = tag.split("-")[0];
    if (isLocale(primary)) return primary;
  }
  return defaultLocale;
}

export function resolveLocale(
  preference: LanguageOption | null | undefined,
  acceptLanguage: string | null,
): Locale {
  if (preference && preference !== "system" && isLocale(preference)) {
    return preference;
  }
  return negotiateLocale(acceptLanguage);
}
