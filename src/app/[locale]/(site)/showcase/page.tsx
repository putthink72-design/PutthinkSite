import { fetchShowcaseFeed, getSessionUserId } from "@/lib/showcase-data";
import { ShowcaseFeed } from "@/components/showcase/ShowcaseFeed";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export default async function ShowcasePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.showcase;

  const userId = await getSessionUserId();
  const items = await fetchShowcaseFeed({ userId });

  return (
    <>
      <header className="page-hero light">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.title}</h1>
          <p className="sub" style={{ color: "var(--g-2)" }}>
            {t.pageSub}
          </p>
        </div>
      </header>

      <section className="sec light" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ShowcaseFeed items={items} />
        </div>
      </section>
    </>
  );
}
