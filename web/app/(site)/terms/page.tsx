import type { Metadata } from "next";
import { Badge, Ornament } from "@/components/ui";
import { serverApi } from "@/lib/api";
import { arNum, type SiteContent } from "@/lib/types";

export const metadata: Metadata = { title: "الشروط والخصوصية" };

export default async function TermsPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "52px 0", position: "relative", overflow: "hidden" }}>
        <Ornament size={160} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-30px", insetInlineEnd: "8%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>الشروط والخصوصية</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px,3.6vw,40px)", marginBottom: "10px" }}>الشروط والأحكام وسياسة الخصوصية</h1>
          <p style={{ color: "#9fb0bf", fontSize: "15px" }}>آخر تحديث: يونيو ٢٠٢٦</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "820px" }}>
          {content.terms.length === 0 ? (
            <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: "56px 24px", textAlign: "center", color: "var(--muted)", fontSize: "16px" }}>
              لا توجد بنود منشورة حالياً.
            </div>
          ) : (
            content.terms.map((s, i) => (
              <div key={i} style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "21px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ width: 32, height: 32, borderRadius: "9px", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", fontSize: "15px", fontWeight: 900, flexShrink: 0 }}>{arNum(i + 1)}</span>
                  {s.title}
                </h2>
                <p style={{ color: "var(--ink-2)", fontSize: "16px", lineHeight: 1.95, paddingInlineStart: "44px" }}>{s.body}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
