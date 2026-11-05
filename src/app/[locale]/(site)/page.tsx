import { CTA } from "@/components/home/CTA";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Invite } from "@/components/home/Invite";
import { PricingSection } from "@/components/home/Pricing";
import { ProofBar } from "@/components/home/ProofBar";

export default function HomePage() {
  return (
    <>
      <span id="top" />
      <Hero />
      <ProofBar />
      <HowItWorks />
      <PricingSection />
      <Invite />
      <CTA />
    </>
  );
}
