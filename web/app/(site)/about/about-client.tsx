"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Btn, Counter, Icon, Ornament } from "@/components/ui";
import { useLocale } from "@/components/locale-context";
import type { SiteContent } from "@/lib/types";

type Instructor = SiteContent["instructor"];

/** Scanned credential documents (static assets; captions live in the dicts). */
const CERTS = [
  {
    key: "azhar",
    doc: "/certificates/azhar-degree.jpg",
    attest: "/certificates/azhar-attestation.jpg",
    titleKey: "certAzharTitle",
    issuerKey: "certAzharIssuer",
  },
  {
    key: "edu",
    doc: "/certificates/edu-diploma.jpg",
    attest: "/certificates/edu-attestation.jpg",
    titleKey: "certEduTitle",
    issuerKey: "certEduIssuer",
  },
] as const;

type CertKey = (typeof CERTS)[number]["key"];

export function AboutClient({ instructor }: { instructor: Instructor }) {
  const router = useRouter();
  const { t } = useLocale();
  const [viewer, setViewer] = useState<{ cert: CertKey; tab: "doc" | "attest" } | null>(null);

  // Lightbox: Esc closes, page scroll locks while open.
  useEffect(() => {
    if (!viewer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [viewer]);

  const active = viewer ? CERTS.find((c) => c.key === viewer.cert) : null;
  const activeSrc = active && viewer ? (viewer.tab === "doc" ? active.doc : active.attest) : null;

  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,#fdfaf4,#f3ecdf)", padding: "64px 0", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-40px" }} />
        <div className="wrap about-grid" style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "48px", alignItems: "center", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "16px -12px -16px 16px", borderRadius: "var(--r-xl)", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", transform: "rotate(2.5deg)" }} />
            <img src="/instructor.png" alt={t.about.instructorAlt} style={{ position: "relative", width: "100%", borderRadius: "var(--r-xl)", border: "5px solid #fff", boxShadow: "var(--shadow-lg)", aspectRatio: "696/900", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <Badge tone="gold" style={{ marginBottom: "16px" }}>{t.about.badge}</Badge>
            <h1 style={{ fontSize: "clamp(30px,4vw,46px)", marginBottom: "10px" }}>{instructor.name}</h1>
            <p style={{ color: "var(--gold-700)", fontSize: "17px", fontWeight: 700, marginBottom: "22px" }}>{instructor.title}</p>
            {instructor.bio.map((p, i) => (
              <p key={i} style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.95, marginBottom: "16px" }}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: "14px", marginTop: "26px", flexWrap: "wrap" }}>
              <Btn variant="gold" iconAfter="arrow" onClick={() => router.push("/courses")}>{t.about.browseCourses}</Btn>
              <Btn variant="outline" icon="mail" onClick={() => router.push("/contact")}>{t.about.contactHim}</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* المؤهّلات */}
      <section className="section">
        <div className="wrap">
          <div className="about-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>{t.about.credentialsTitle}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {instructor.credentials.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", background: "var(--paper)", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
                    <span style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="cap" size={21} /></span>
                    <span style={{ fontSize: "15.5px", fontWeight: 600, color: "var(--ink)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>{t.about.statsTitle}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {instructor.stats.map((s, i) => (
                  <div key={i} style={{ background: "linear-gradient(160deg,var(--navy-700),var(--navy-900))", borderRadius: "var(--r-lg)", padding: "26px", color: "#fff", textAlign: "center" }}>
                    <div style={{ fontSize: "34px", fontWeight: 900, color: "var(--gold-400)", lineHeight: 1 }}><Counter value={s.value} suffix={s.suffix} /></div>
                    <div style={{ fontSize: "13.5px", color: "#9fb0bf", marginTop: "8px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* الشهادات والتوثيقات */}
      <section className="section" style={{ background: "var(--cream-2)", paddingTop: "72px", paddingBottom: "88px" }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{t.about.certsTitle}</span>
            <h2>{t.about.certsTitle}</h2>
            <p>{t.about.certsSub}</p>
          </div>
          <div className="about-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px", maxWidth: "920px", margin: "0 auto" }}>
            {CERTS.map((c) => (
              <button
                key={c.key}
                onClick={() => setViewer({ cert: c.key, tab: "doc" })}
                title={t.about.certZoomHint}
                style={{ textAlign: "start", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "var(--r-lg)", padding: "14px", boxShadow: "var(--shadow-sm)", transition: "transform .2s, box-shadow .2s", display: "block" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
              >
                <span style={{ position: "relative", display: "block", borderRadius: "var(--r)", overflow: "hidden", background: "var(--cream)", border: "1px solid var(--line-2)" }}>
                  <img src={c.doc} alt={t.about[c.titleKey]} loading="lazy" style={{ width: "100%", aspectRatio: "7/9", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                  <span style={{ position: "absolute", insetInline: 0, bottom: 0, padding: "26px 14px 10px", background: "linear-gradient(to top, rgba(10,31,54,.55), transparent)", color: "#fff", fontSize: "12.5px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                    <Icon name="search" size={14} /> {t.about.certZoomHint}
                  </span>
                </span>
                <span style={{ display: "block", padding: "14px 6px 4px" }}>
                  <span style={{ display: "block", fontWeight: 800, fontSize: "15.5px", color: "var(--navy-900)", lineHeight: 1.6, marginBottom: "6px" }}>{t.about[c.titleKey]}</span>
                  <span style={{ display: "block", fontSize: "13px", color: "var(--ink-2)", marginBottom: "10px" }}>{t.about[c.issuerKey]}</span>
                  <Badge tone="green"><Icon name="shield" size={13} /> {t.about.certAttested}</Badge>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* عارض الشهادة */}
      {viewer && active && activeSrc && (
        <div
          onClick={() => setViewer(null)}
          role="dialog"
          aria-modal="true"
          aria-label={t.about[active.titleKey]}
          style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10,31,54,.72)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: "20px" }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", boxShadow: "var(--shadow-lg)", width: "min(640px, 94vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px", borderBottom: "1px solid var(--line)" }}>
              {(["doc", "attest"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setViewer({ cert: viewer.cert, tab })}
                  style={{
                    padding: "8px 18px", borderRadius: "999px", fontSize: "13.5px", fontWeight: 700,
                    background: viewer.tab === tab ? "var(--navy-800)" : "var(--cream-2)",
                    color: viewer.tab === tab ? "#fff" : "var(--ink-2)",
                  }}
                >
                  {tab === "doc" ? t.about.certTabDoc : t.about.certTabAttest}
                </button>
              ))}
              <a
                href={activeSrc}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginInlineStart: "auto", fontSize: "13px", fontWeight: 700, color: "var(--gold-700)", display: "inline-flex", alignItems: "center", gap: "5px" }}
              >
                <Icon name="eye" size={15} /> {t.about.certOpenFull}
              </a>
              <button
                onClick={() => setViewer(null)}
                title={t.about.certClose}
                style={{ width: 34, height: 34, borderRadius: "10px", background: "var(--cream-2)", color: "var(--navy-900)", display: "grid", placeItems: "center" }}
              >
                <Icon name="x" size={17} />
              </button>
            </div>
            <div style={{ overflowY: "auto", background: "var(--cream)" }}>
              <img src={activeSrc} alt={t.about[active.titleKey]} style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
