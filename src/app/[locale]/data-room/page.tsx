import type { Metadata } from "next";
import { Dashboard } from "@/components/data-room/Dashboard";
import { requireDataRoomAccess } from "@/lib/data-room-access";

export const metadata: Metadata = {
  title: "Data Room 대시보드",
  robots: { index: false, follow: false },
};

export default async function DataRoomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireDataRoomAccess(locale);
  return <Dashboard />;
}
