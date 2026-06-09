"use client";

import { useMemo, useState } from "react";
import { arNum, type CategoryListItem } from "@/lib/types";
import { Badge, Icon, Ornament } from "@/components/ui";
import { CategoryCard } from "@/components/category-card";

export function CoursesClient({ categories }: { categories: CategoryListItem[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const levels = useMemo(
    () => ["all", ...new Set(categories.map((c) => c.level))],
    [categories],
  );
  const levelLabel = (l: string) => (l === "all" ? "الكل" : l);
  const list = categories.filter(
    (c) =>
      (filter === "all" || c.level === filter) &&
      (q === "" || (c.title + c.tagline + c.desc).includes(q)),
  );
  return (
    <div>
      {/* رأس الصفحة */}
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0 64px", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.09)" style={{ position: "absolute", top: "-50px", insetInlineEnd: "5%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>كتالوج الكورسات</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,46px)", marginBottom: "14px" }}>كل المسارات التعليمية في مكانٍ واحد</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "620px", lineHeight: 1.8 }}>اختر المسار والمرحلة المناسبة لك أو لأبنائك — الدرس الأول من كل وحدة مجاني.</p>
        </div>
      </section>

      {/* أدوات البحث والتصفية */}
      <div style={{ background: "var(--paper)", borderBottom: "1px solid var(--line)", position: "sticky", top: "76px", zIndex: 30, boxShadow: "var(--shadow-sm)" }}>
        <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "18px 24px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--cream)", border: "1px solid var(--line)", borderRadius: "999px", padding: "11px 20px", flexGrow: 1, minWidth: "240px", maxWidth: "420px" }}>
            <Icon name="search" size={19} style={{ color: "var(--muted)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن مسار أو مادة…" style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "15px", color: "var(--ink)" }} />
            {q && <button onClick={() => setQ("")} style={{ color: "var(--muted)" }}><Icon name="x" size={17} /></button>}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginInlineStart: "auto" }}>
            {levels.map((l) => (
              <button key={l} onClick={() => setFilter(l)} style={{ padding: "9px 18px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, transition: "all .2s", background: filter === l ? "var(--navy-800)" : "var(--cream-2)", color: filter === l ? "#fff" : "var(--ink-2)" }}>{levelLabel(l)}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: "56px" }}>
        <div className="wrap">
          <div style={{ color: "var(--muted)", fontSize: "14.5px", fontWeight: 600, marginBottom: "24px" }}>{arNum(list.length)} مسار{list.length !== 1 ? "ات" : ""} تعليمي</div>
          {categories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <Icon name="book" size={48} style={{ opacity: 0.4, margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px" }}>لا توجد مسارات متاحة حالياً.</p>
            </div>
          ) : list.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <Icon name="search" size={48} style={{ opacity: 0.4, margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px" }}>لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          ) : (
            <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
              {list.map((c, i) => <CategoryCard key={c.id} cat={c} idx={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
