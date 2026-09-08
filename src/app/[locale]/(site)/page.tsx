import { CTA } from "@/components/home/CTA";
import { HallOfFame } from "@/components/home/HallOfFame";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Invite } from "@/components/home/Invite";
import { PricingSection } from "@/components/home/Pricing";
import { ProofBar } from "@/components/home/ProofBar";
import { ShowcasePreview } from "@/components/home/ShowcasePreview";

export default function HomePage() {
  return (
    <>
      <span id="top" />
      <Hero />
      <ProofBar />
      <HowItWorks />
      <ShowcasePreview />
      <HallOfFame />
      <PricingSection />
      <Invite />
      <CTA />
    </>
  );
}
