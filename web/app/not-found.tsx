import type { Metadata } from "next";
import Link from "next/link";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.errors.notFoundMetaTitle };
}

/** صفحة ٤٠٤ الجذرية — مستقلة عن تخطيط (site)، بأنماط مضمّنة من متغيرات globals.css. */
export default async function NotFound() {
  const t = getDict(await getServerLocale());
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--cream)",
        padding: "32px 20px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "460px" }}>
        <div
          className="serif"
          style={{
            fontSize: "clamp(80px, 16vw, 120px)",
            fontWeight: 700,
            color: "var(--navy-900)",
            lineHeight: 1.1,
          }}
        >
          ٤٠٤
        </div>
        <div
          aria-hidden="true"
          style={{
            width: "56px",
            height: "4px",
            borderRadius: "999px",
            background: "var(--gold)",
            margin: "14px auto 22px",
          }}
        />
        <h1
          style={{
            color: "var(--navy-900)",
            fontSize: "clamp(22px, 4vw, 28px)",
            fontWeight: 800,
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          {t.errors.notFoundTitle}
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>
          {t.errors.notFoundDescription}
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "var(--gold)",
            color: "#fff",
            borderRadius: "999px",
            padding: "12px 32px",
            fontWeight: 800,
            fontSize: "15px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {t.errors.backHome}
        </Link>
      </div>
    </main>
  );
}
