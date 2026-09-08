import type { Metadata } from "next";
import { Dashboard } from "@/components/data-room/Dashboard";

export const metadata: Metadata = {
  title: "Data Room 대시보드",
  robots: { index: false, follow: false },
};

/**
 * Auth gate (magic link + approved data_room_requests) will be enforced in
 * this layout once Supabase env vars are configured. Until then, mock dashboard.
 */
export default function DataRoomPage() {
  return <Dashboard />;
}
