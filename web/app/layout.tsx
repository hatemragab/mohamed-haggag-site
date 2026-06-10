import type { Metadata } from "next";
import { Amiri, Inter, Tajawal } from "next/font/google";
import { AuthProvider } from "@/components/auth-context";
import { LocaleProvider } from "@/components/locale-context";
import { dir as dirOf } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const m = getDict(locale).meta;
  return {
    title: { default: m.rootTitleDefault, template: m.rootTitleTemplate },
    description: m.rootDescription,
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getServerLocale();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      data-scroll-behavior="smooth"
      className={`${tajawal.variable} ${amiri.variable} ${inter.variable} loc-${locale}`}
    >
      <body>
        <LocaleProvider initialLocale={locale}>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
