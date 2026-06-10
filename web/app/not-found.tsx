import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "الصفحة غير موجودة" };

/** صفحة ٤٠٤ الجذرية — مستقلة عن تخطيط (site)، بأنماط مضمّنة من متغيرات globals.css. */
export default function NotFound() {
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
          هذه الصفحة غير موجودة
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>
          ربما تغيّر عنوان الصفحة أو حُذفت. يمكنك العودة إلى الصفحة الرئيسية ومتابعة التصفح.
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
          العودة للرئيسية
        </Link>
      </div>
    </main>
  );
}
