"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { Btn, Icon } from "./ui";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الكورسات" },
  { href: "/pricing", label: "الباقات والأسعار" },
  { href: "/about", label: "عن الأستاذ" },
  { href: "/faq", label: "الأسئلة الشائعة" },
  { href: "/contact", label: "تواصل معنا" },
] as const;

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f);
    f();
    return () => window.removeEventListener("scroll", f);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(250,246,238,.88)" : "rgba(250,246,238,0)",
        backdropFilter: scrolled ? "saturate(160%) blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        transition: "all .3s ease",
      }}
    >
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "20px", height: "76px" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ width: "44px", height: "44px", borderRadius: "13px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden" }}>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>م</span>
          </span>
          <span style={{ textAlign: "right", lineHeight: 1.2 }}>
            <span style={{ display: "block", fontWeight: 800, fontSize: "16px", color: "var(--navy-900)" }}>الأستاذ محمد حجاج</span>
            <span style={{ display: "block", fontSize: "11.5px", color: "var(--gold-700)", fontWeight: 700 }}>منصة تعليمية أزهرية</span>
          </span>
        </Link>

        <nav style={{ display: "flex", gap: "4px", marginInlineStart: "auto" }} className="desk-nav">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "9px 15px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
                color: isActive(l.href) ? "var(--navy-900)" : "var(--ink-2)",
                background: isActive(l.href) ? "var(--gold-100)" : "transparent",
                transition: "all .2s",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="desk-cta">
          {user ? (
            <>
              <Btn variant="ghost" size="sm" icon="grid" onClick={() => router.push("/dashboard")}>لوحتي</Btn>
              <button
                onClick={() => { void logout().then(() => router.push("/")); }}
                title="خروج"
                style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: "10px", background: "var(--cream-2)", color: "var(--ink-2)" }}
              >
                <Icon name="logout" size={18} />
              </button>
            </>
          ) : (
            <>
              <Btn variant="ghost" size="sm" onClick={() => router.push("/login")}>دخول</Btn>
              <Btn variant="gold" size="sm" onClick={() => router.push("/register")}>أنشئ حسابك</Btn>
            </>
          )}
        </div>

        <button
          className="burger"
          onClick={() => setOpen((o) => !o)}
          aria-label="القائمة"
          style={{ display: "none", width: 42, height: 42, placeItems: "center", borderRadius: "10px", background: "var(--cream-2)", color: "var(--navy-900)" }}
        >
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="mobile-menu" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", padding: "16px 24px 24px", boxShadow: "var(--shadow)" }}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: "block", width: "100%", textAlign: "right", padding: "13px 8px", borderBottom: "1px solid var(--line-2)", fontSize: "16px", fontWeight: 700, color: isActive(l.href) ? "var(--gold-700)" : "var(--ink)" }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {user ? (
              <Btn variant="primary" full onClick={() => { setOpen(false); router.push("/dashboard"); }}>لوحة الطالب</Btn>
            ) : (
              <>
                <Btn variant="outline" full onClick={() => { setOpen(false); router.push("/login"); }}>دخول</Btn>
                <Btn variant="gold" full onClick={() => { setOpen(false); router.push("/register"); }}>حساب جديد</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
