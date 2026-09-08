"use client";

import { useLayoutEffect } from "react";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";

export function HtmlLang({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    for (const l of locales) {
      root.classList.toggle(`locale-${l}`, l === locale);
    }
  }, [locale]);
  return null;
}
