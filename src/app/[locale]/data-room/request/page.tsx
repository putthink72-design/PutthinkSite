import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestForm } from "@/components/data-room/RequestForm";

export const metadata: Metadata = {
  title: "Data Room 접근 요청",
  robots: { index: false, follow: false },
};

export default function DataRoomRequestPage() {
  return (
    <Suspense fallback={null}>
      <RequestForm />
    </Suspense>
  );
}
