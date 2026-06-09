"use client";

import { useEffect, useRef, useState } from "react";
import {
  ABtn,
  ACard,
  AInput,
  AModal,
  AToggle,
  AdminHead,
  Icon,
  confirmDel,
} from "@/components/admin-ui";
import { ApiError, apiDelete, apiGet, apiPatch, apiPost } from "@/lib/client";
import { type Student, arDate, arNum } from "@/lib/types";

const STATUS_AR: Record<Student["status"], string> = {
  active: "نشط",
  suspended: "متوقف",
};

const errMsg = (e: unknown): string =>
  e instanceof ApiError ? e.message : "حدث خطأ غير متوقع";

interface AddForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  grantAll: boolean;
}

const EMPTY_FORM: AddForm = { name: "", email: "", password: "", phone: "", grantAll: false };

export default function StudentsClient() {
  const [list, setList] = useState<Student[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [tick, setTick] = useState(0);
  const [add, setAdd] = useState(false);
  const [f, setF] = useState<AddForm>(EMPTY_FORM);
  const [addErr, setAddErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const first = useRef(true);

  /* جلب القائمة — البحث يتم في الخادم مع تأخير ~٣٠٠م/ث */
  useEffect(() => {
    let alive = true;
    const run = () => {
      apiGet<Student[]>(`/admin/students?q=${encodeURIComponent(q)}`)
        .then((data) => {
          if (!alive) return;
          setList(data);
          setErr(null);
        })
        .catch((e: unknown) => {
          if (alive) setErr(errMsg(e));
        });
    };
    if (first.current) {
      first.current = false;
      run();
      return () => {
        alive = false;
      };
    }
    const t = setTimeout(run, 300);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [q, tick]);

  const toggle = async (s: Student) => {
    try {
      const r = await apiPatch<{ id: string; status: Student["status"] }>(
        `/admin/students/${s.id}/status`,
      );
      setList((l) => (l ? l.map((x) => (x.id === r.id ? { ...x, status: r.status } : x)) : l));
    } catch (e: unknown) {
      window.alert(errMsg(e));
    }
  };

  const del = async (s: Student) => {
    if (!confirmDel(`حذف الطالب «${s.name}»؟`)) return;
    try {
      await apiDelete<unknown>(`/admin/students/${s.id}`);
      setList((l) => (l ? l.filter((x) => x.id !== s.id) : l));
    } catch (e: unknown) {
      window.alert(errMsg(e));
    }
  };

  const commit = async () => {
    if (!f.name.trim() || !f.email.trim()) return;
    if (f.password.length < 6) {
      setAddErr("كلمة المرور يجب ألا تقل عن ٦ أحرف");
      return;
    }
    setSaving(true);
    setAddErr(null);
    try {
      const body: { name: string; email: string; password: string; phone?: string; grantAll?: boolean } = {
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.password,
      };
      if (f.phone.trim()) body.phone = f.phone.trim();
      if (f.grantAll) body.grantAll = true;
      const fresh = await apiPost<Student[]>("/admin/students", body);
      setList(fresh);
      setAdd(false);
      setF(EMPTY_FORM);
    } catch (e: unknown) {
      setAddErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  /* حالة التحميل الأولى */
  if (list === null && !err)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  /* خطأ قبل أول تحميل ناجح */
  if (list === null)
    return (
      <ACard style={{ textAlign: "center", padding: "36px" }}>
        <p style={{ color: "var(--bad)", fontSize: "14px", fontWeight: 700, marginBottom: "14px" }}>{err}</p>
        <ABtn tone="ghost" onClick={() => setTick((t) => t + 1)}>إعادة المحاولة</ABtn>
      </ACard>
    );

  return (
    <>
      <AdminHead title="الطلاب" sub={`${arNum(list.length)} طالب مسجّل`} action={
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث بالاسم أو البريد…" style={{ width: "200px", background: "var(--panel)", border: "1.5px solid var(--line-dark)", borderRadius: "10px", padding: "10px 14px", fontSize: "13.5px", color: "#fff", outline: "none" }} onFocus={(e) => (e.target.style.borderColor = "var(--gold)")} onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")} />
          <ABtn icon="user" onClick={() => { setAddErr(null); setAdd(true); }}>إضافة طالب</ABtn>
        </div>
      } />
      {err && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <span style={{ color: "var(--bad)", fontSize: "13px", fontWeight: 700 }}>{err}</span>
          <ABtn tone="ghost" size="sm" onClick={() => setTick((t) => t + 1)}>إعادة المحاولة</ABtn>
        </div>
      )}
      <ACard style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1.2fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid var(--line-dark)", fontSize: "12.5px", fontWeight: 700, color: "var(--text-dim)" }} className="stu-head">
          <span>الاسم</span><span>البريد</span><span>الباقة</span><span>الحالة</span><span></span>
        </div>
        {list.map((s) => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1.2fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid var(--line-darker)", alignItems: "center" }} className="stu-row">
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{s.name}</div>
              <div style={{ color: "var(--text-dim)", fontSize: "11.5px" }}>انضم {arDate(s.joined)}</div>
            </div>
            <span style={{ color: "var(--text-mute)", fontSize: "13px", direction: "ltr", textAlign: "right" }}>{s.email}</span>
            <span style={{ color: "var(--text-soft)", fontSize: "13px" }}>{s.plan}</span>
            <button onClick={() => toggle(s)} style={{ justifySelf: "start", fontSize: "11.5px", fontWeight: 700, color: s.status === "active" ? "var(--ok)" : "var(--bad)", background: s.status === "active" ? "rgba(63,125,94,.18)" : "rgba(180,69,47,.16)", padding: "4px 12px", borderRadius: "999px" }}>{STATUS_AR[s.status]}</button>
            <button onClick={() => del(s)} style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center" }}><Icon name="x" size={16} /></button>
          </div>
        ))}
        {list.length === 0 && <div style={{ color: "var(--text-dim)", textAlign: "center", padding: "36px", fontSize: "14px" }}>لا توجد نتائج مطابقة.</div>}
      </ACard>
      {add && (
        <AModal title="إضافة طالب" onClose={() => setAdd(false)}>
          <AInput label="الاسم" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoFocus />
          <AInput label="البريد الإلكتروني" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} mono />
          <AInput label="كلمة المرور" type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} mono />
          <p style={{ color: "var(--text-dim)", fontSize: "11.5px", marginTop: "-10px", marginBottom: "14px" }}>كلمة المرور المبدئية للطالب</p>
          <AInput label="الهاتف (اختياري)" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} mono />
          <div style={{ marginBottom: "16px" }}>
            <AToggle on={f.grantAll} onClick={() => setF({ ...f, grantAll: !f.grantAll })} label="فتح جميع المسارات (دفع يدوي)" />
          </div>
          {addErr && <p style={{ color: "var(--bad)", fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>{addErr}</p>}
          <ABtn full icon="check" onClick={commit} disabled={saving}>إضافة</ABtn>
        </AModal>
      )}
    </>
  );
}
