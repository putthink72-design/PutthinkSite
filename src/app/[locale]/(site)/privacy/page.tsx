import { LegalDocument } from "@/components/LegalDocument";
import { isLocale } from "@/i18n/config";
import { getPrivacy } from "@/i18n/legal";
import { notFound } from "next/navigation";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <section className="sec">
      <div className="wrap">
        <LegalDocument source={getPrivacy(locale)} />
      </div>
    </section>
  );
}
