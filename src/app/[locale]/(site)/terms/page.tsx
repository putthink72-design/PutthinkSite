import { LegalDocument } from "@/components/LegalDocument";
import { isLocale } from "@/i18n/config";
import { getTerms } from "@/i18n/legal";
import { notFound } from "next/navigation";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <section className="sec">
      <div className="wrap">
        <LegalDocument source={getTerms(locale)} />
      </div>
    </section>
  );
}
