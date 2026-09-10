"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
import type { LiveShowcaseCard } from "@/lib/showcase-data";
import { ShowcaseCardView } from "@/components/showcase/ShowcaseCardView";

const CAT_IDS = ["all", "long_putt", "multi_break", "recovery", "first_holed"] as const;

export function ShowcaseFeed({ items }: { items: LiveShowcaseCard[] }) {
  const { dict } = useI18n();
  const t = dict.showcase;
  const [cat, setCat] = useState<string>("all");

  const filtered = useMemo(
    () => (cat === "all" ? items : items.filter((i) => i.category === cat)),
    [cat, items],
  );

  return (
    <>
      <div className="cats">
        {CAT_IDS.map((id) => (
          <button
            key={id}
            type="button"
            className={`cat${cat === id ? " on" : ""}`}
            onClick={() => setCat(id)}
          >
            {t.cats[id]}
          </button>
        ))}
      </div>
      <div className="feed">
        {filtered.map((item) => (
          <ShowcaseCardView key={item.id} item={item} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p style={{ color: "var(--g-2)", textAlign: "center", padding: 40 }}>
          {t.empty}
        </p>
      )}
    </>
  );
}
