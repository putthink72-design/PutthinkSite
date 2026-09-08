import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Room",
  robots: { index: false, follow: false },
};

export default function DataRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="dr-body">{children}</div>;
}
