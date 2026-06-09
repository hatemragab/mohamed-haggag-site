"use client";

import { useCallback, useEffect, useState } from "react";
import { ABtn, ACard, AdminHead, Icon, confirmDel } from "@/components/admin-ui";
import { ApiError, apiDelete, apiGet } from "@/lib/client";
import {
  type AdminOrder,
  CURRENCY_LABELS,
  ORDER_STATUS_AR,
  arDate,
  arNum,
} from "@/lib/types";

const errMsg = (e: unknown) =>
  e instanceof ApiError ? e.message : "حدث خطأ غير متوقع";

export default function PaymentsClient() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = useCallback(() => {
    apiGet<AdminOrder[]>("/orders")
      .then((data) => setOrders(data))
      .catch((e: unknown) => setError(errMsg(e)));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const retry = () => {
    setError(null);
    setOrders(null);
    load();
  };

  const del = async (p: AdminOrder) => {
    if (!confirmDel("حذف هذه العملية؟")) return;
    try {
      await apiDelete<unknown>(`/orders/${p.id}`);
      setOrders((prev) => (prev ? prev.filter((x) => x.id !== p.id) : prev));
      setActionError(null);
    } catch (e) {
      setActionError(errMsg(e));
    }
  };

  if (error)
    return (
      <>
        <AdminHead title="المدفوعات" />
        <ACard>
          <p style={{ color: "var(--bad)", fontSize: "14px", marginBottom: "14px" }}>{error}</p>
          <ABtn tone="outline" size="sm" onClick={retry}>إعادة المحاولة</ABtn>
        </ACard>
      </>
    );

  if (!orders)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  const total = orders.filter((p) => p.status === "paid").length;

  return (
    <>
      <AdminHead title="المدفوعات" sub={`${arNum(total)} عملية ناجحة من ${arNum(orders.length)}`} />
      {actionError && (
        <p style={{ color: "var(--bad)", fontSize: "13.5px", marginBottom: "14px" }}>{actionError}</p>
      )}
      <ACard style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid var(--line-dark)", fontSize: "12.5px", fontWeight: 700, color: "var(--text-dim)" }} className="stu-head">
          <span>الطالب</span><span>الباقة</span><span>المبلغ</span><span>التاريخ</span><span>الحالة</span><span></span>
        </div>
        {orders.length === 0 && (
          <div style={{ padding: "26px 20px", textAlign: "center", color: "var(--text-mute)", fontSize: "14px" }}>لا توجد مدفوعات بعد.</div>
        )}
        {orders.map((p) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid var(--line-darker)", alignItems: "center" }} className="stu-row">
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{p.student}</span>
            <span style={{ color: "var(--text-soft)", fontSize: "13px" }}>{p.planName}</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{arNum(p.amount)} {CURRENCY_LABELS[p.currency]}</span>
            <span style={{ color: "var(--text-mute)", fontSize: "13px" }}>{arDate(p.createdAt)}</span>
            <span style={{ justifySelf: "start", fontSize: "11.5px", fontWeight: 700, color: p.status === "paid" ? "var(--ok)" : "var(--bad)", background: p.status === "paid" ? "rgba(63,125,94,.18)" : "rgba(180,69,47,.16)", padding: "4px 12px", borderRadius: "999px" }}>{ORDER_STATUS_AR[p.status]}</span>
            <button onClick={() => void del(p)} style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center" }}><Icon name="x" size={16} /></button>
          </div>
        ))}
      </ACard>
    </>
  );
}
