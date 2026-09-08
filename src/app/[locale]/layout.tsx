import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  LOCALE_COOKIE,
  isLanguageOption,
  isLocale,
  locales,
  type LanguageOption,
  type Locale,
} from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/provider";
import { HtmlLang } from "@/components/HtmlLang";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);
  return {
    title: {
      default: `${dict.meta.title} — ${dict.meta.tagline}`,
      template: `%s · ${dict.meta.title}`,
    },
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.ogDescription,
      type: "website",
      locale: raw === "ko" ? "ko_KR" : raw === "ja" ? "ja_JP" : "en_US",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const jar = await cookies();
  const rawPref = jar.get(LOCALE_COOKIE)?.value;
  const preference: LanguageOption =
    rawPref && isLanguageOption(rawPref) ? rawPref : "system";

  const dict = await getDictionary(locale);

  return (
    <I18nProvider locale={locale} preference={preference} dict={dict}>
      <HtmlLang locale={locale} />
      <div className={`site-root locale-${locale}`} lang={locale}>
        {children}
      </div>
    </I18nProvider>
  );
}
