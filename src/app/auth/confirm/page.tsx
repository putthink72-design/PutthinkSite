import { Suspense } from "react";
import type { Metadata } from "next";
import ConfirmClient from "./ConfirmClient";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            fontFamily: "Pretendard, system-ui, sans-serif",
          }}
        >
          로그인 처리 중…
        </div>
      }
    >
      <ConfirmClient />
    </Suspense>
  );
}
