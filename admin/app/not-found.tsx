import Link from "next/link";

/** صفحة ٤٠٤ للوحة الإدارة — كحلية داكنة بنفس نمط صفحة الدخول. */
export default function NotFound() {
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
        <div
          className="serif"
          style={{
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: 1.2,
            background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "6px",
          }}
        >
          ٤٠٤
        </div>
        <h1 style={{ color: "#fff", fontWeight: 800, fontSize: "21px", marginBottom: "10px" }}>
          الصفحة غير موجودة
        </h1>
        <p style={{ color: "var(--text-mute)", fontSize: "14.5px", marginBottom: "26px" }}>
          عذرًا، لم نعثر على الصفحة التي تبحث عنها داخل لوحة الإدارة.
        </p>
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
            background: "linear-gradient(180deg,var(--gold-400),var(--gold))",
            color: "var(--navy-900)",
          }}
        >
          العودة للوحة
        </Link>
      </div>
    </div>
  );
}
