"use client";

import { PricingSection } from "@/components/home/Pricing";
import { Invite } from "@/components/home/Invite";
import { useI18n } from "@/i18n/provider";

export default function PricingPage() {
  const { dict } = useI18n();
  const t = dict.pricing;

  return (
    <>
      <header className="page-hero">
        <div className="wrap">
          <div className="eyebrow">{t.eyebrow}</div>
          <h1 style={{ fontSize: "clamp(36px,5vw,56px)" }}>{t.pageTitle}</h1>
          <p className="sub">{t.pageSub}</p>
        </div>
      </header>
      <PricingSection />
      <Invite />
    </>
  );
}
