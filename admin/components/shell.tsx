"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdminAuth } from "./auth-context";
import { Icon, IconName } from "./admin-ui";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/overview", label: "نظرة عامة", icon: "grid" },
  { href: "/categories", label: "الأقسام والمستويات", icon: "layers" },
  { href: "/videos", label: "الفيديوهات والدروس", icon: "play" },
  { href: "/content", label: "المحتوى العام", icon: "book" },
  { href: "/testimonials", label: "التقييمات", icon: "star" },
  { href: "/students", label: "الطلاب", icon: "user" },
  { href: "/payments", label: "المدفوعات", icon: "card" },
];

export const LAST_TAB_KEY = "mh_admin_tab";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [openM, setOpenM] = useState(false);

  // تذكّر آخر تبويب نشط (مثل النموذج الأولي)
  useEffect(() => {
    if (TABS.some((t) => pathname.startsWith(t.href))) {
      try {
        localStorage.setItem(LAST_TAB_KEY, pathname);
      } catch {
        /* localStorage may be unavailable */
      }
    }
    setOpenM(false);
  }, [pathname]);

  const item = (t: (typeof TABS)[number]) => {
    const active = pathname.startsWith(t.href);
    return (
      <Link
        key={t.href}
        href={t.href}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "12px",
          padding: "12px 14px", borderRadius: "11px", marginBottom: "3px",
          textAlign: "right", fontSize: "14.5px", fontWeight: 700, transition: "all .18s",
          color: active ? "#fff" : "var(--text-mute)",
          background: active ? "linear-gradient(90deg,rgba(191,145,64,.18),transparent)" : "transparent",
          boxShadow: active ? "inset 2px 0 0 var(--gold)" : "none",
        }}
      >
        <Icon name={t.icon} size={19} style={{ color: active ? "var(--gold-400)" : "var(--text-dim)" }} />
        {t.label}
      </Link>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--navy-900)", display: "flex" }}>
      {/* سايدبار */}
      <aside
        className="admin-side"
        style={{
          width: "260px", flexShrink: 0, background: "var(--panel)",
          borderInlineEnd: "1px solid var(--line-dark)", padding: "22px 16px",
          position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "11px", padding: "6px 8px 22px", borderBottom: "1px solid var(--line-dark)", marginBottom: "16px" }}>
          <span style={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", color: "var(--navy-900)" }}>
            <Icon name="shield" size={22} />
          </span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>لوحة الإدارة</div>
            <div style={{ color: "var(--text-dim)", fontSize: "11.5px" }}>الأستاذ محمد حجاج</div>
          </div>
        </div>
        {TABS.map(item)}
        <div style={{ borderTop: "1px solid var(--line-dark)", marginTop: "16px", paddingTop: "16px" }}>
          <a
            href={SITE_URL}
            target="_blank"
            rel="noreferrer"
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "var(--text-mute)" }}
          >
            <Icon name="globe" size={18} /> عرض الموقع
          </a>
          <button
            onClick={() => { void logout().then(() => router.replace("/login")); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "var(--bad)" }}
          >
            <Icon name="logout" size={18} /> خروج
          </button>
        </div>
      </aside>

      {/* المحتوى */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div
          className="admin-topbar"
          style={{ alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "var(--panel)", borderBottom: "1px solid var(--line-dark)", position: "sticky", top: 0, zIndex: 40 }}
        >
          <button onClick={() => setOpenM((o) => !o)} style={{ color: "#fff" }} aria-label="القائمة">
            <Icon name="menu" size={24} />
          </button>
          <span style={{ color: "#fff", fontWeight: 800 }}>لوحة الإدارة</span>
        </div>
        {openM && (
          <div className="admin-mobile-nav" style={{ background: "var(--panel)", borderBottom: "1px solid var(--line-dark)", padding: "10px" }}>
            {TABS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                style={{ display: "block", width: "100%", textAlign: "right", padding: "12px", color: pathname.startsWith(t.href) ? "var(--gold-400)" : "var(--text-soft)", fontWeight: 700 }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        )}
        <div style={{ padding: "32px", maxWidth: "1100px" }} className="admin-content page-fade">
          {children}
        </div>
      </div>
    </div>
  );
}
