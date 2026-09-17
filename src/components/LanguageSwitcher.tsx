"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  languageOptions,
  type LanguageOption,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

function stripLocale(pathname: string): string {
  const parts = pathname.split("/");
  if (parts[1] === "ko" || parts[1] === "en" || parts[1] === "ja") {
    const rest = "/" + parts.slice(2).join("/");
    return rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  }
  return pathname;
}

function setPreferenceCookie(option: LanguageOption) {
  document.cookie = `${LOCALE_COOKIE}=${option};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

function detectSystemLocale(): Locale {
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const raw of langs) {
    const primary = raw.toLowerCase().split("-")[0];
    if (primary === "ko" || primary === "en" || primary === "ja") {
      return primary;
    }
  }
  return "ko";
}

export function LanguageSwitcher() {
  const { locale, preference, dict } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  // Cookie preference can disagree with URL locale (e.g. magic link → /en/…).
  // Keep the path on the locked language so the switcher label matches the page.
  useEffect(() => {
    if (preference === "system") return;
    if (preference === locale) return;
    const rest = stripLocale(pathname);
    const dest = rest === "/" ? `/${preference}` : `/${preference}${rest}`;
    router.replace(dest);
  }, [preference, locale, pathname, router]);

  const onChange = (next: LanguageOption) => {
    setPreferenceCookie(next);
    const targetLocale: Locale =
      next === "system" ? detectSystemLocale() : next;
    const rest = stripLocale(pathname);
    const dest = rest === "/" ? `/${targetLocale}` : `/${targetLocale}${rest}`;
    router.push(dest);
    router.refresh();
  };

  return (
    <label className="lang-switch">
      <span className="sr-only">{dict.language.label}</span>
      <select
        aria-label={dict.language.label}
        value={preference}
        onChange={(e) => onChange(e.target.value as LanguageOption)}
      >
        {languageOptions.map((opt) => (
          <option key={opt} value={opt}>
            {dict.language[opt]}
            {opt === "system" ? ` (${locale.toUpperCase()})` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
