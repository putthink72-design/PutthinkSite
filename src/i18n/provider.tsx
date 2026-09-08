"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { LanguageOption, Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

type I18nValue = {
  locale: Locale;
  preference: LanguageOption;
  dict: Dictionary;
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  preference,
  dict,
  children,
}: {
  locale: Locale;
  preference: LanguageOption;
  dict: Dictionary;
  children: ReactNode;
}) {
  const href = useCallback(
    (path: string) => {
      const clean = path.startsWith("/") ? path : `/${path}`;
      if (clean === "/") return `/${locale}`;
      return `/${locale}${clean}`;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, preference, dict, href }),
    [locale, preference, dict, href],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
