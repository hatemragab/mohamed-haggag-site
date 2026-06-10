"use client";

import Link from "next/link";
import { useEffect } from "react";

/** صفحة الخطأ العامّة للوحة الإدارة — كحلية داكنة ومستقلة (نمط صفحة الدخول). */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 30% 20%, var(--navy-700), var(--navy-900) 60%)",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div
        className="page-fade"
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "var(--card)",
          border: "1px solid var(--line-dark)",
          borderRadius: "22px",
          padding: "44px 36px",
          boxShadow: "var(--shadow-lg)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            width: 58,
            height: 58,
            margin: "0 auto 20px",
            borderRadius: "16px",
            background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))",
            display: "grid",
            placeItems: "center",
            color: "var(--navy-900)",
          }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="16" x2="12" y2="16.01" />
          </svg>
        </span>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "22px", marginBottom: "10px" }}>
          حدث خطأ غير متوقع
        </h1>
        <p style={{ color: "var(--text-mute)", fontSize: "14.5px", marginBottom: "26px" }}>
          نعتذر عن هذا الخلل. يمكنك إعادة المحاولة، وإذا استمرت المشكلة فعد إلى
          لوحة التحكم الرئيسية.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "14.5px",
              padding: "11px 24px",
              background: "linear-gradient(180deg,var(--gold-400),var(--gold))",
              color: "var(--navy-900)",
              transition: "filter .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "14.5px",
              padding: "11px 24px",
              background: "transparent",
              color: "var(--text-soft)",
              boxShadow: "inset 0 0 0 1.5px #2a4863",
            }}
          >
            العودة للوحة
          </Link>
        </div>
        {error.digest && (
          <p
            dir="ltr"
            style={{ color: "var(--text-dim)", fontSize: "12px", marginTop: "22px" }}
          >
            {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
