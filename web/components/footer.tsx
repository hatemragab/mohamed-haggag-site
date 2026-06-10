"use client";

import Link from "next/link";
import { useLocale } from "./locale-context";
import { Icon } from "./ui";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001";

const COLS = [
  {
    titleKey: "colPlatform",
    links: [
      ["/", "home"],
      ["/courses", "courses"],
      ["/pricing", "pricing"],
      ["/about", "about"],
    ],
  },
  {
    titleKey: "colHelp",
    links: [
      ["/faq", "faq"],
      ["/contact", "contact"],
      ["/terms", "terms"],
    ],
  },
  {
    titleKey: "colAccount",
    links: [
      ["/register", "register"],
      ["/login", "login"],
      ["/dashboard", "dashboard"],
    ],
  },
] as const;

export function Footer({ footerText }: { footerText: string }) {
  const { t } = useLocale();
  const f = t.footer;
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
              <div style={{ fontWeight: 800, fontSize: "17px", color: "#fff" }}>{f.brandName}</div>
              <div style={{ fontSize: "12px", color: "var(--gold-400)" }}>{f.brandTag}</div>
            </div>
          </div>
          <p style={{ fontSize: "14.5px", lineHeight: 1.9, maxWidth: "320px", color: "#9fb0bf" }}>{footerText}</p>
        </div>
        {COLS.map((c) => (
          <div key={c.titleKey}>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: "16px", fontSize: "15px" }}>{f[c.titleKey]}</div>
            {c.links.map(([href, key]) => (
              <Link
                key={href}
                href={href}
                style={{ display: "block", color: "#9fb0bf", fontSize: "14.5px", padding: "7px 0", transition: "color .2s", fontWeight: 500 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-400)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#9fb0bf")}
              >
                {f.nav[key]}
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
          <span>© {new Date().getFullYear()} {f.platformName} — {f.rights}</span>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <a
              href={ADMIN_URL}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7f909f", fontWeight: 700, transition: "color .2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-400)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7f909f")}
            >
              <Icon name="shield" size={15} /> {f.adminLogin}
            </a>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "17px" }}>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
