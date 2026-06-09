"use client";

import Link from "next/link";
import { Icon } from "./ui";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

const COLS = [
  {
    title: "المنصة",
    links: [
      ["/", "الرئيسية"],
      ["/courses", "الكورسات"],
      ["/pricing", "الباقات والأسعار"],
      ["/about", "عن الأستاذ"],
    ],
  },
  {
    title: "المساعدة",
    links: [
      ["/faq", "الأسئلة الشائعة"],
      ["/contact", "تواصل معنا"],
      ["/terms", "الشروط والخصوصية"],
    ],
  },
  {
    title: "الحساب",
    links: [
      ["/register", "إنشاء حساب"],
      ["/login", "تسجيل الدخول"],
      ["/dashboard", "لوحة الطالب"],
    ],
  },
] as const;

export function Footer({ footerText }: { footerText: string }) {
  return (
    <footer style={{ background: "var(--navy-900)", color: "#cdd7e0", paddingTop: "72px" }}>
      <div
        className="wrap foot-grid"
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "40px", paddingBottom: "56px" }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center" }}>
              <span className="serif" style={{ color: "var(--navy-900)", fontSize: "25px", fontWeight: 700 }}>م</span>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "17px", color: "#fff" }}>الأستاذ محمد حجاج</div>
              <div style={{ fontSize: "12px", color: "var(--gold-400)" }}>منصة تعليمية أزهرية</div>
            </div>
          </div>
          <p style={{ fontSize: "14.5px", lineHeight: 1.9, maxWidth: "320px", color: "#9fb0bf" }}>{footerText}</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: "16px", fontSize: "15px" }}>{c.title}</div>
            {c.links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ display: "block", color: "#9fb0bf", fontSize: "14.5px", padding: "7px 0", transition: "color .2s", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-400)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9fb0bf")}
              >
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div
          className="wrap"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", padding: "22px 24px", fontSize: "13.5px", color: "#7f909f" }}
        >
          <span>© {new Date().getFullYear()} منصة الأستاذ محمد حجاج التعليمية — جميع الحقوق محفوظة.</span>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <a
              href={ADMIN_URL}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7f909f", fontWeight: 700, transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-400)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7f909f")}
            >
              <Icon name="shield" size={15} /> دخول الإدارة
            </a>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "17px" }}>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
