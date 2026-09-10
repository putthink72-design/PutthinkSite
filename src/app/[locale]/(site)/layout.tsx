import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { LoginModal } from "@/components/auth/LoginModal";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <LoginModal />
    </AuthProvider>
  );
}
