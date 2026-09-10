import { CTA } from "@/components/home/CTA";
import { HallOfFame } from "@/components/home/HallOfFame";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Invite } from "@/components/home/Invite";
import { PricingSection } from "@/components/home/Pricing";
import { ProofBar } from "@/components/home/ProofBar";
import { ShowcasePreview } from "@/components/home/ShowcasePreview";
import {
  fetchHallOfFame,
  fetchShowcaseFeed,
  getSessionUserId,
} from "@/lib/showcase-data";

export default async function HomePage() {
  const userId = await getSessionUserId();
  const [showcase, hof] = await Promise.all([
    fetchShowcaseFeed({ userId, limit: 3 }),
    fetchHallOfFame({ limit: 4 }),
  ]);

  return (
    <>
      <span id="top" />
      <Hero />
      <ProofBar />
      <HowItWorks />
      <ShowcasePreview items={showcase} />
      <HallOfFame items={hof} />
      <PricingSection />
      <Invite />
      <CTA />
    </>
  );
}
