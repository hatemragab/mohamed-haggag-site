"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import { useLocale } from "@/components/locale-context";
import type { SiteContent } from "@/lib/types";

export function FaqClient({ faq }: { faq: SiteContent["faq"] }) {
  const [open, setOpen] = useState<number>(0);
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Ornament size={180} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-40px", insetInlineEnd: "10%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>{t.faq.badge}</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,44px)", marginBottom: "12px" }}>{t.faq.heroTitle}</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "560px", margin: "0 auto" }}>{t.faq.heroSubtitle}</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "820px" }}>
          {faq.length === 0 ? (
            <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: "56px 24px", textAlign: "center", color: "var(--muted)", fontSize: "16px" }}>
              {t.faq.emptyState}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {faq.map((f, i) => (
                <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: open === i ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 24px", textAlign: "start" }}>
                    <span style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--navy-900)" }}>{f.q}</span>
                    <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: open === i ? "var(--gold)" : "var(--cream-2)", color: open === i ? "#fff" : "var(--navy-800)", display: "grid", placeItems: "center", transition: "all .25s", transform: open === i ? "rotate(180deg)" : "none" }}><Icon name="chevD" size={18} /></span>
                  </button>
                  <div style={{ maxHeight: open === i ? "420px" : "0", overflow: "hidden", transition: "max-height .35s cubic-bezier(.2,.7,.2,1)" }}>
                    <p style={{ padding: "0 24px 22px", color: "var(--ink-2)", fontSize: "15.5px", lineHeight: 1.9 }}>{f.a}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: "40px", background: "var(--cream-2)", borderRadius: "var(--r-lg)", padding: "36px", textAlign: "center" }}>
            <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>{t.faq.ctaTitle}</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "22px" }}>{t.faq.ctaSubtitle}</p>
            <Btn variant="primary" icon="mail" onClick={() => router.push("/contact")}>{t.faq.ctaButton}</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
