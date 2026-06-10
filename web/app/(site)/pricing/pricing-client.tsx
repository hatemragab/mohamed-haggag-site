"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import { useLocale } from "@/components/locale-context";
import { CURRENCIES, type Plan } from "@/lib/types";

type Currency = (typeof CURRENCIES)[number];

/** الباقات والأسعار — منقولة بأمانة من النموذج الأولي */
export function PricingClient({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const { t, num } = useLocale();
  const [cur, setCur] = useState<Currency>(CURRENCIES[0]);

  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0 130px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <Ornament size={200} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-40px", insetInlineEnd: "8%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>{t.pricing.headerBadge}</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,46px)", marginBottom: "14px" }}>{t.pricing.headerTitle}</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "580px", margin: "0 auto 30px", lineHeight: 1.8 }}>{t.pricing.headerSubtitle}</p>
          {/* مبدّل العملة */}
          <div style={{ display: "inline-flex", gap: "4px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: "999px", padding: "5px" }}>
            {CURRENCIES.map((c) => (
              <button key={c.code} onClick={() => setCur(c)} style={{ padding: "9px 22px", borderRadius: "999px", fontSize: "14px", fontWeight: 800, transition: "all .2s", background: cur.code === c.code ? "var(--gold)" : "transparent", color: cur.code === c.code ? "var(--navy-900)" : "#cdd7e0" }}>{t.common.currencies[c.code].name}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: "-90px", paddingBottom: "90px", position: "relative" }}>
        <div className="wrap">
          {plans.length === 0 ? (
            <div style={{ background: "var(--paper)", borderRadius: "var(--r-xl)", border: "1px solid var(--line)", boxShadow: "var(--shadow)", padding: "60px 30px", textAlign: "center" }}>
              <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "inline-grid", placeItems: "center", marginBottom: "18px" }}><Icon name="card" size={28} /></span>
              <h3 style={{ fontSize: "22px", color: "var(--navy-900)", marginBottom: "8px" }}>{t.pricing.emptyTitle}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "15px" }}>{t.pricing.emptySubtitle}</p>
            </div>
          ) : (
            <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", alignItems: "stretch" }}>
              {plans.map((p) => (
                <div key={p.key} style={{ background: p.highlight ? "linear-gradient(170deg,var(--navy-800),var(--navy-900))" : "var(--paper)", borderRadius: "var(--r-xl)", padding: "34px 30px", border: p.highlight ? "none" : "1px solid var(--line)", boxShadow: p.highlight ? "var(--shadow-lg)" : "var(--shadow)", position: "relative", transform: p.highlight ? "scale(1.03)" : "none", color: p.highlight ? "#fff" : "var(--ink)", display: "flex", flexDirection: "column" }} className="plan-card">
                  {p.highlight && <div style={{ position: "absolute", top: "-14px", insetInlineStart: "50%", transform: "translateX(50%)", background: "var(--gold)", color: "var(--navy-900)", fontSize: "13px", fontWeight: 800, padding: "6px 18px", borderRadius: "999px", boxShadow: "var(--shadow)" }}>{t.pricing.mostPopular}</div>}
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: p.highlight ? "var(--gold-400)" : "var(--gold-700)", marginBottom: "6px" }}>{p.tagline}</div>
                  <h3 style={{ fontSize: "23px", color: p.highlight ? "#fff" : "var(--navy-900)", marginBottom: "16px" }}>{p.name}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "42px", fontWeight: 900, color: p.highlight ? "#fff" : "var(--navy-900)", lineHeight: 1 }}>{num(p.prices[cur.code])}</span>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: p.highlight ? "var(--gold-400)" : "var(--gold-700)" }}>{t.common.currencies[cur.code].symbol}</span>
                  </div>
                  <div style={{ fontSize: "14px", color: p.highlight ? "#9fb0bf" : "var(--muted)", marginBottom: "26px" }}>{p.period}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "28px", flexGrow: 1 }}>
                    {p.features.map((ft, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px", fontSize: "14.5px", lineHeight: 1.5, color: p.highlight ? "#dde6ee" : "var(--ink-2)" }}>
                        <span style={{ width: 22, height: 22, borderRadius: "50%", background: p.highlight ? "rgba(191,145,64,.25)" : "#e4efe9", color: p.highlight ? "var(--gold-400)" : "var(--green)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: "1px" }}><Icon name="check" size={13} stroke={2.6} /></span>
                        {ft}
                      </div>
                    ))}
                  </div>
                  <Btn variant={p.highlight ? "gold" : "primary"} size="lg" full iconAfter="arrow" onClick={() => router.push(`/checkout?plan=${p.key}`)}>{p.cta}</Btn>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: "40px", display: "flex", gap: "28px", justifyContent: "center", flexWrap: "wrap", color: "var(--ink-2)", fontSize: "14.5px", fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="shield" size={18} style={{ color: "var(--green)" }} /> {t.pricing.trustSecure}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="check" size={18} style={{ color: "var(--green)" }} /> {t.pricing.trustRefund}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="card" size={18} style={{ color: "var(--green)" }} /> {t.pricing.trustPayments}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
