"use client";

import { useEffect, useRef, useState } from "react";
import {
  AArea,
  ABtn,
  ACard,
  AdminHead,
  AInput,
  AModal,
  confirmDel,
  Icon,
} from "@/components/admin-ui";
import { apiDelete, apiGet, apiPatch, apiPost, ApiError } from "@/lib/client";
import type { Testimonial } from "@/lib/types";

type EditState = { new: true } | { id: string };
type FormState = { name: string; role: string; text: string };

const blank: FormState = { name: "", role: "", text: "" };

const msgOf = (e: unknown): string =>
  e instanceof ApiError ? e.message : "حدث خطأ غير متوقع";

export default function TestimonialsClient() {
  const [list, setList] = useState<Testimonial[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [form, setForm] = useState<FormState>(blank);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const pending = useRef(false);

  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    apiGet<Testimonial[]>("/testimonials")
      .then((fresh) => {
        if (!alive) return;
        setList(fresh);
        setLoadErr(null);
      })
      .catch((e: unknown) => {
        if (alive) setLoadErr(msgOf(e));
      });
    return () => {
      alive = false;
    };
  }, [tick]);

  const retry = () => {
    setLoadErr(null);
    setList(null);
    setTick((t) => t + 1);
  };

  const openNew = () => {
    setForm(blank);
    setSaveErr(null);
    setEdit({ new: true });
  };
  const openEdit = (t: Testimonial) => {
    setForm({ name: t.name, role: t.role, text: t.text });
    setSaveErr(null);
    setEdit({ id: t.id });
  };

  const commit = async () => {
    if (!edit || !form.name.trim() || !form.text.trim()) return;
    setSaving(true);
    setSaveErr(null);
    try {
      const fresh =
        "new" in edit
          ? await apiPost<Testimonial[]>("/testimonials", form)
          : await apiPatch<Testimonial[]>(`/testimonials/${edit.id}`, form);
      setList(fresh);
      setEdit(null);
    } catch (e) {
      setSaveErr(msgOf(e));
    } finally {
      setSaving(false);
    }
  };

  const del = async (t: Testimonial) => {
    if (!confirmDel("حذف هذا التقييم؟")) return;
    setActionErr(null);
    try {
      setList(await apiDelete<Testimonial[]>(`/testimonials/${t.id}`));
    } catch (e) {
      setActionErr(msgOf(e));
    }
  };

  const move = async (i: number, dir: -1 | 1) => {
    if (!list || pending.current) return;
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    const orderedIds = next.map((t) => t.id);
    pending.current = true;
    setActionErr(null);
    try {
      setList(await apiPatch<Testimonial[]>("/testimonials/reorder", { orderedIds }));
    } catch (e) {
      setActionErr(msgOf(e));
    } finally {
      pending.current = false;
    }
  };

  if (loadErr)
    return (
      <>
        <AdminHead title="التقييمات" sub="أول ٣ تقييمات تظهر في الصفحة الرئيسية — رتّبها بالأسهم" />
        <ACard style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--bad)", fontSize: "14px", marginBottom: "16px" }}>{loadErr}</p>
          <ABtn tone="outline" onClick={retry}>إعادة المحاولة</ABtn>
        </ACard>
      </>
    );

  if (!list)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  return (
    <>
      <AdminHead
        title="التقييمات"
        sub="أول ٣ تقييمات تظهر في الصفحة الرئيسية — رتّبها بالأسهم"
        action={<ABtn icon="star" onClick={openNew}>إضافة تقييم</ABtn>}
      />
      {actionErr && (
        <p style={{ color: "var(--bad)", fontSize: "13.5px", marginBottom: "12px" }}>{actionErr}</p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {list.map((t, i) => (
          <ACard
            key={t.id}
            style={{
              display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 18px",
              ...(i < 3 ? { borderColor: "rgba(191,145,64,.35)" } : {}),
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0, marginTop: "2px" }}>
              <button
                onClick={() => void move(i, -1)}
                disabled={i === 0}
                title="تحريك لأعلى"
                style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === 0 ? "#2a4863" : "var(--text-mute)", cursor: i === 0 ? "default" : "pointer" }}
              >
                <Icon name="up" size={14} />
              </button>
              <button
                onClick={() => void move(i, 1)}
                disabled={i === list.length - 1}
                title="تحريك لأسفل"
                style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === list.length - 1 ? "#2a4863" : "var(--text-mute)", cursor: i === list.length - 1 ? "default" : "pointer" }}
              >
                <Icon name="down" size={14} />
              </button>
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>{t.name}</span>
                <span style={{ color: "var(--text-dim)", fontSize: "12.5px" }}>{t.role}</span>
                {i < 3 && (
                  <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--gold-400)", background: "rgba(191,145,64,.14)", padding: "2px 9px", borderRadius: "999px" }}>
                    تظهر في الرئيسية
                  </span>
                )}
              </div>
              <p style={{ color: "var(--text-soft)", fontSize: "13.5px", lineHeight: 1.8 }}>«{t.text}»</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => openEdit(t)}
                title="تعديل"
                style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "var(--text-soft)", display: "grid", placeItems: "center" }}
              >
                <Icon name="book" size={16} />
              </button>
              <button
                onClick={() => void del(t)}
                title="حذف"
                style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center" }}
              >
                <Icon name="x" size={16} />
              </button>
            </div>
          </ACard>
        ))}
        {list.length === 0 && (
          <div style={{ color: "var(--text-dim)", textAlign: "center", padding: "40px", fontSize: "14px" }}>
            لا توجد تقييمات بعد — أضف أول تقييم.
          </div>
        )}
      </div>
      {edit && (
        <AModal title={"new" in edit ? "إضافة تقييم" : "تعديل التقييم"} onClose={() => setEdit(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <AInput label="الاسم" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: أم عبدالله" autoFocus />
            <AInput label="الصفة" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="مثال: ولية أمر — أبوظبي" />
          </div>
          <AArea label="نص التقييم" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} rows={4} />
          {saveErr && (
            <p style={{ color: "var(--bad)", fontSize: "13px", marginBottom: "10px" }}>{saveErr}</p>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <ABtn full onClick={() => void commit()} icon="check" disabled={saving}>حفظ</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}
    </>
  );
}
