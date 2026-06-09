import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await serverApi<SiteContent>("/site-content");
  return (
    <>
      <Header />
      <main className="page-fade">{children}</main>
      <Footer footerText={content.footerText} />
    </>
  );
}
