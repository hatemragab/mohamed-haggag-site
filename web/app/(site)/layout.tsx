import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { SiteContent } from "@/lib/types";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await serverApi<SiteContent>("/site-content");
  const t = getDict(await getServerLocale());
  return (
    <>
      <a href="#main" className="skip-link">{t.common.skipToContent}</a>
      <Header />
      <main id="main" className="page-fade">{children}</main>
      <Footer footerText={content.footerText} />
    </>
  );
}
