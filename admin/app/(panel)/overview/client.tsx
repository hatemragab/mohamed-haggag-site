"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ABtn, ACard, AdminHead, Icon, type IconName } from "@/components/admin-ui";
import { apiGet } from "@/lib/client";
import {
  CURRENCY_LABELS,
  ORDER_STATUS_AR,
  arDate,
  arNum,
  type AdminOrder,
  type CurrencyCode,
  type Overview,
} from "@/lib/types";

/** الحالة بالعربية — ORDER_STATUS_AR مع ردّ آمن لأي قيمة غير معروفة. */
const statusAr = (s: string): string =>
  ORDER_STATUS_AR[s as AdminOrder["status"]] ?? s;

/** رمز العملة — CURRENCY_LABELS مع ردّ آمن لأي عملة غير معروفة. */
const curLabel = (c: string): string =>
  CURRENCY_LABELS[c as CurrencyCode] ?? c;

export default function OverviewClient() {
  const router = useRouter();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiGet<Overview>("/admin/overview")
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "حدث خطأ غير متوقع"),
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const retry = () => {
    setError(null);
    setData(null);
    load();
  };

  if (error)
    return (
      <>
        <AdminHead title="نظرة عامة" sub="ملخّص أداء المنصة وأحدث النشاطات" />
        <ACard style={{ textAlign: "center" }}>
          <p style={{ color: "var(--bad)", fontSize: "14.5px", fontWeight: 700, marginBottom: "14px" }}>{error}</p>
          <ABtn tone="outline" onClick={retry}>إعادة المحاولة</ABtn>
        </ACard>
      </>
    );

  if (!data)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  const kpis: { ic: IconName; v: number; l: string; c: string }[] = [
    { ic: "user", v: data.kpis.students, l: "إجمالي الطلاب", c: "var(--gold-400)" },
    { ic: "layers", v: data.kpis.categories, l: "الأقسام الرئيسية", c: "#6fb0e0" },
    { ic: "play", v: data.kpis.lessons, l: "إجمالي الدروس", c: "var(--ok)" },
    { ic: "card", v: data.kpis.payments, l: "عمليات الدفع", c: "#d9a3e0" },
  ];

  return (
    <>
      <AdminHead
        title="نظرة عامة"
        sub="ملخّص أداء المنصة وأحدث النشاطات"
        action={<ABtn icon="play" onClick={() => router.push("/videos")}>إضافة درس</ABtn>}
      />
      <div className="admin-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "26px" }}>
        {kpis.map((k, i) => (
          <ACard key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ width: 52, height: 52, borderRadius: "14px", background: "var(--panel)", color: k.c, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={k.ic} size={25} /></span>
            <div>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>{arNum(k.v)}</div>
              <div style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "4px" }}>{k.l}</div>
            </div>
          </ACard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }} className="admin-2col">
        <ACard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff", fontSize: "17px" }}>أحدث المدفوعات</h3>
            <Link href="/payments" style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>عرض الكل</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.latestPayments.length === 0 && (
              <p style={{ color: "var(--text-mute)", fontSize: "13.5px" }}>لا توجد مدفوعات بعد.</p>
            )}
            {data.latestPayments.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", background: "var(--panel)", borderRadius: "11px" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>{p.student}</div>
                  <div style={{ color: "var(--text-dim)", fontSize: "12px" }}>{p.plan} · {arDate(p.date)}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{arNum(p.amount)} {curLabel(p.currency)}</div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: p.status === "paid" ? "var(--ok)" : "var(--bad)" }}>{statusAr(p.status)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--line-dark)", flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-dim)", fontSize: "12.5px", fontWeight: 700 }}>إجمالي الإيرادات الناجحة</span>
            <span style={{ color: "var(--ok)", fontWeight: 800, fontSize: "14px" }}>{Object.entries(data.revenue).map(([c, v]) => `${arNum(v)} ${curLabel(c)}`).join(" · ") || "—"}</span>
          </div>
        </ACard>
        <ACard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff", fontSize: "17px" }}>الإحصاءات المعروضة</h3>
            <Link href="/content" style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>تعديل</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {data.displayedStats.map((s, i) => (
              <div key={i} style={{ padding: "12px", background: "var(--panel)", borderRadius: "11px", textAlign: "center" }}>
                <div style={{ color: "var(--gold-400)", fontWeight: 900, fontSize: "20px" }}>{arNum(s.value)}{s.suffix}</div>
                <div style={{ color: "var(--text-dim)", fontSize: "11.5px", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </ACard>
      </div>
    </>
  );
}
