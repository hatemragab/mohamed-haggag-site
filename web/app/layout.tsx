import type { Metadata } from "next";
import { Amiri, Tajawal } from "next/font/google";
import { AuthProvider } from "@/components/auth-context";
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

export const metadata: Metadata = {
  title: {
    default: "منصة الأستاذ محمد حجاج التعليمية",
    template: "%s · منصة الأستاذ محمد حجاج",
  },
  description:
    "منصة تعليمية متخصصة في اللغة العربية والعلوم الشرعية وتعليم القرآن الكريم، بإشراف معلّم أزهري موثوق.",
  openGraph: {
    title: "منصة الأستاذ محمد حجاج التعليمية",
    description:
      "تأسيس، ومناهج إماراتية ومصرية وأزهرية، وعربية لغير الناطقين بها، وتعليم القرآن الكريم.",
    locale: "ar_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      className={`${tajawal.variable} ${amiri.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
