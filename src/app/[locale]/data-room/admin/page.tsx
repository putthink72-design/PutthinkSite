import type { Metadata } from "next";
import DataRoomAdminPage from "./DataRoomAdminClient";

export const metadata: Metadata = {
  title: "Data Room Admin",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <DataRoomAdminPage />;
}
