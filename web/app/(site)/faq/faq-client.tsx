"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import type { SiteContent } from "@/lib/types";

export function FaqClient({ faq }: { faq: SiteContent["faq"] }) {
  const [open, setOpen] = useState<number>(0);
  const router = useRouter();
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Ornament size={180} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-40px", insetInlineEnd: "10%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>الأسئلة الشائعة</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,44px)", marginBottom: "12px" }}>كل ما تريد معرفته</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "560px", margin: "0 auto" }}>إجابات واضحة على أكثر الأسئلة شيوعاً من الطلاب وأولياء الأمور.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "820px" }}>
          {faq.length === 0 ? (
            <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: "56px 24px", textAlign: "center", color: "var(--muted)", fontSize: "16px" }}>
              لا توجد أسئلة منشورة حالياً.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {faq.map((f, i) => (
                <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: open === i ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 24px", textAlign: "right" }}>
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
            <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>لم تجد إجابتك؟</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "22px" }}>فريقنا سعيد بمساعدتك في أي وقت.</p>
            <Btn variant="primary" icon="mail" onClick={() => router.push("/contact")}>تواصل معنا</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}
