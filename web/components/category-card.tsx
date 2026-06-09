"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { arNum, CategoryListItem } from "@/lib/types";
import { Badge, Icon } from "./ui";

export function CategoryCard({ cat, idx = 0 }: { cat: CategoryListItem; idx?: number }) {
  const router = useRouter();
  const [h, setH] = useState(false);
  return (
    <button
      onClick={() => router.push(`/courses/${cat.slug}`)}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      className="reveal"
      style={{
        textAlign: "right", background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "28px",
        border: "1px solid var(--line)", boxShadow: h ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: h ? "translateY(-4px)" : "none", transition: "all .28s cubic-bezier(.2,.7,.2,1)",
        position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
        animationDelay: `${idx * 60}ms`,
      }}
    >
      <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, background: "radial-gradient(circle, var(--gold-100), transparent 70%)", opacity: h ? 1 : 0.5, transition: "opacity .3s" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px", position: "relative" }}>
        <span style={{ width: "62px", height: "62px", borderRadius: "18px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
          <span className="serif" style={{ color: "var(--gold-400)", fontSize: "30px", fontWeight: 700 }}>{cat.glyph}</span>
        </span>
        <Badge tone="gold">{cat.level}</Badge>
      </div>
      <h3 style={{ fontSize: "20px", marginBottom: "6px", position: "relative" }}>{cat.title}</h3>
      <div style={{ color: "var(--gold-700)", fontSize: "13.5px", fontWeight: 700, marginBottom: "12px" }}>{cat.tagline}</div>
      <p style={{ color: "var(--ink-2)", fontSize: "14.5px", lineHeight: 1.75, flexGrow: 1 }}>{cat.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid var(--line-2)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13.5px", color: "var(--muted)", fontWeight: 700 }}>
          <Icon name="layers" size={16} /> {arNum(cat.levelsCount)} مستوى
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--navy-700)", fontWeight: 800, fontSize: "14px", transform: h ? "translateX(-4px)" : "none", transition: "transform .25s" }}>
          استعرض <Icon name="arrow" size={17} />
        </span>
      </div>
    </button>
  );
}
