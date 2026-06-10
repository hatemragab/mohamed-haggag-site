"use client"; // حدود الأخطاء يجب أن تكون مكوّنات عميل

import { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/components/locale-context";

/**
 * حدود الخطأ الجذرية — تُعرض خارج تخطيط (site) فلا رأس ولا تذييل هنا.
 * صفحة مستقلة بأنماط مضمّنة تعتمد متغيرات globals.css.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLocale();
  useEffect(() => {
    console.error(error);
  }, [error]);

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
        <span
          aria-hidden="true"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))",
            display: "inline-grid",
            placeItems: "center",
            boxShadow: "var(--shadow-sm)",
            marginBottom: "22px",
          }}
        >
          <span className="serif" style={{ color: "var(--gold-400)", fontSize: "34px", fontWeight: 700, lineHeight: 1 }}>م</span>
        </span>
        <h1
          style={{
            color: "var(--navy-900)",
            fontSize: "clamp(24px, 4vw, 32px)",
            fontWeight: 800,
            marginBottom: "10px",
            lineHeight: 1.4,
          }}
        >
          {t.errors.title}
        </h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>
          {t.errors.description}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => reset()}
            style={{
              background: "var(--gold)",
              color: "#fff",
              borderRadius: "999px",
              padding: "12px 30px",
              fontWeight: 800,
              fontSize: "15px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {t.errors.retry}
          </button>
          <Link
            href="/"
            style={{
              background: "var(--paper)",
              border: "1.5px solid var(--line)",
              color: "var(--navy-900)",
              borderRadius: "999px",
              padding: "12px 30px",
              fontWeight: 700,
              fontSize: "15px",
            }}
          >
            {t.errors.backHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
