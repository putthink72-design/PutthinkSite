import { fetchHallOfFame } from "@/lib/showcase-data";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

function hofMeta(
  clubName: string,
  courseName: string,
  holeNumber: number,
  holeUnit: string,
  catLabel: string,
) {
  return `${clubName} · ${courseName} · ${holeNumber}${holeUnit} · ${catLabel}`;
}

export default async function HofPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = await getDictionary(locale);
  const t = dict.hof;
  const s = dict.showcase;
  const items = await fetchHallOfFame();

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
          <div className="hof">
            {items.map((item) => (
              <div className="hcard" key={`${item.period}-${item.id}`}>
                <div className="th">
                  <span className="mo mono">{item.period}</span>
                  <span className="cr" aria-hidden="true">
                    🏆
                  </span>
                </div>
                <div className="hb">
                  <div className="n">{item.nickname}</div>
                  <div className="ct">{item.caption}</div>
                  <div className="d mono">
                    {hofMeta(
                      item.clubName,
                      item.courseName,
                      item.holeNumber,
                      s.holeUnit,
                      s.cats[item.category],
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
