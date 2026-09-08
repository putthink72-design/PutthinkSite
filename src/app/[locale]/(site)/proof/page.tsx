"use client";

import { useI18n } from "@/i18n/provider";
import { MOCK_FIELD_TESTS } from "@/lib/mock-data";

export default function ProofPage() {
  const { dict } = useI18n();
  const t = dict.proofPage;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.title}</h1>
          <p className="sub">{t.sub}</p>
        </div>
      </header>
      <section className="sec">
        <div className="wrap">
          <div className="bento">
            {MOCK_FIELD_TESTS.map((test) => (
              <div className="bx" key={test.testNo}>
                <div className="num mono">
                  TEST #{test.testNo} · {test.date}
                </div>
                <h3>
                  {test.total} / {test.holed} · {test.conceded}
                </h3>
                <p>{t.cardBody}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
