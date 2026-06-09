"use client";

import { useRouter } from "next/navigation";
import { Badge, Btn, Counter, Icon, Ornament } from "@/components/ui";
import type { SiteContent } from "@/lib/types";

type Instructor = SiteContent["instructor"];

export function AboutClient({ instructor }: { instructor: Instructor }) {
  const router = useRouter();
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,#fdfaf4,#f3ecdf)", padding: "64px 0", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-40px" }} />
        <div className="wrap about-grid" style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "48px", alignItems: "center", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "16px -12px -16px 16px", borderRadius: "var(--r-xl)", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", transform: "rotate(2.5deg)" }} />
            <img src="/instructor.png" alt="الأستاذ محمد حجاج" style={{ position: "relative", width: "100%", borderRadius: "var(--r-xl)", border: "5px solid #fff", boxShadow: "var(--shadow-lg)", aspectRatio: "696/900", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <Badge tone="gold" style={{ marginBottom: "16px" }}>عن الأستاذ</Badge>
            <h1 style={{ fontSize: "clamp(30px,4vw,46px)", marginBottom: "10px" }}>{instructor.name}</h1>
            <p style={{ color: "var(--gold-700)", fontSize: "17px", fontWeight: 700, marginBottom: "22px" }}>{instructor.title}</p>
            {instructor.bio.map((p, i) => (
              <p key={i} style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.95, marginBottom: "16px" }}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: "14px", marginTop: "26px", flexWrap: "wrap" }}>
              <Btn variant="gold" iconAfter="arrow" onClick={() => router.push("/courses")}>استعرض كورساته</Btn>
              <Btn variant="outline" icon="mail" onClick={() => router.push("/contact")}>تواصل معه</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* المؤهّلات */}
      <section className="section">
        <div className="wrap">
          <div className="about-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>المؤهّلات والخبرة</h2>
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
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>بالأرقام</h2>
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
    </div>
  );
}
