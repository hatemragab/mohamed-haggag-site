"use client";

/* تبويب المحتوى العام — منقول من النموذج الأولي (ContentTab) وموسَّع بحيث
   تكون كل نصوص الموقع قابلة للتعديل، كل قسم في بطاقة لها زر حفظ مستقل. */

import { useCallback, useEffect, useRef, useState } from "react";
import { AArea, ABtn, ACard, AdminHead, AInput, confirmDel, Icon } from "@/components/admin-ui";
import { apiGet, apiPatch } from "@/lib/client";
import type { CurrencyCode, Plan, SiteContent } from "@/lib/types";
import { arNum } from "@/lib/types";

/* ===== أنماط مشتركة داخل البطاقات (نفس لغة النموذج الأولي) ===== */
const lbl: React.CSSProperties = { display: "block", fontSize: "11px", color: "var(--text-dim)", marginBottom: "5px" };
const h3Style: React.CSSProperties = { color: "#fff", fontSize: "16px", marginBottom: "16px" };
const subHead: React.CSSProperties = { color: "var(--text-soft)", fontSize: "13px", fontWeight: 700, margin: "8px 0 8px" };
const miniInput: React.CSSProperties = { width: "100%", background: "var(--card)", border: "1.5px solid var(--line-dark)", borderRadius: "8px", padding: "8px", color: "#fff", outline: "none" };
const miniInput9: React.CSSProperties = { width: "100%", background: "var(--card)", border: "1.5px solid var(--line-dark)", borderRadius: "8px", padding: "9px", color: "#fff", outline: "none" };
const miniArea: React.CSSProperties = { ...miniInput9, resize: "vertical", lineHeight: 1.7, fontSize: "13.5px" };
const delSm: React.CSSProperties = { width: 30, height: 30, borderRadius: "8px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center", flexShrink: 0 };
const addLink: React.CSSProperties = { marginTop: "9px", color: "var(--gold-400)", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" };
const panelBox: React.CSSProperties = { background: "var(--panel)", borderRadius: "12px", padding: "14px" };

const PRICE_FIELDS: [CurrencyCode, string][] = [["AED", "درهم"], ["EGP", "جنيه"], ["USD", "دولار"]];

/* ===== أدوات مصفوفات صغيرة ===== */
const updAt = <T,>(arr: T[], i: number, v: T): T[] => arr.map((x, j) => (j === i ? v : x));
const rmAt = <T,>(arr: T[], i: number): T[] => arr.filter((_, j) => j !== i);
const swapAt = <T,>(arr: T[], i: number, j: number): T[] => {
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
};

/* ===== زر حفظ القسم + تأكيد «تم الحفظ ✓» المؤقت + رسالة الخطأ ===== */
function SaveBar({ children, onSave }: { children: React.ReactNode; onSave: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const timer = useRef<number | null>(null);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  const click = () => {
    setBusy(true);
    setErr(null);
    setSaved(false);
    onSave()
      .then(() => {
        setSaved(true);
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setSaved(false), 2500);
      })
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : "حدث خطأ غير متوقع"))
      .finally(() => setBusy(false));
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
      <ABtn icon="check" onClick={click} disabled={busy}>{children}</ABtn>
      {saved && <span style={{ color: "var(--ok)", fontSize: "13px", fontWeight: 700 }}>تم الحفظ ✓</span>}
      {err && <span style={{ color: "var(--bad)", fontSize: "13px", fontWeight: 700 }}>{err}</span>}
    </div>
  );
}

export default function Client() {
  const [st, setSt] = useState<SiteContent | null>(null);
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  const load = useCallback(() => {
    Promise.all([apiGet<SiteContent>("/site-content"), apiGet<Plan[]>("/plans")])
      .then(([sc, pl]) => {
        setSt(sc);
        setPlans([...pl].sort((a, b) => a.order - b.order));
        setLoadErr(null);
      })
      .catch((e: unknown) => setLoadErr(e instanceof Error ? e.message : "حدث خطأ غير متوقع"))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  const retry = () => {
    setLoading(true);
    setLoadErr(null);
    load();
  };

  if (loading)
    return (
      <div className="boot" style={{ minHeight: "55vh", background: "transparent" }}>
        <div className="ring" />
      </div>
    );

  if (loadErr || !st || !plans)
    return (
      <>
        <AdminHead title="المحتوى العام" sub="تعديل النصوص والإحصاءات والأسعار الظاهرة في الموقع" />
        <ACard style={{ textAlign: "center", padding: "40px" }}>
          <p style={{ color: "var(--bad)", fontSize: "14.5px", marginBottom: "16px" }}>{loadErr ?? "حدث خطأ غير متوقع"}</p>
          <ABtn onClick={retry}>إعادة المحاولة</ABtn>
        </ACard>
      </>
    );

  const set = (patch: Partial<SiteContent>) => setSt((s) => (s ? { ...s, ...patch } : s));
  const ins = st.instructor;
  const setIns = (patch: Partial<SiteContent["instructor"]>) => set({ instructor: { ...ins, ...patch } });
  const setStat = (i: number, k: "value" | "suffix" | "label", v: string) =>
    setIns({ stats: ins.stats.map((s, j) => (j === i ? { ...s, [k]: k === "value" ? Number(v) || 0 : v } : s)) });
  const setPlan = (i: number, patch: Partial<Plan>) => setPlans(plans.map((p, j) => (j === i ? { ...p, ...patch } : p)));

  /* حفظ الأقسام — كل حفظ يحدّث الحالة المحلية من ردّ الخادم */
  const saveHero = async () => { const r = await apiPatch<SiteContent>("/site-content", { hero: st.hero }); set({ hero: r.hero }); };
  const saveIns = async () => { const r = await apiPatch<SiteContent>("/site-content", { instructor: ins }); set({ instructor: r.instructor }); };
  const saveWhy = async () => { const r = await apiPatch<SiteContent>("/site-content", { why: st.why }); set({ why: r.why }); };
  const saveLearn = async () => {
    const r = await apiPatch<SiteContent>("/site-content", { learnSection: st.learnSection, learn: st.learn });
    set({ learnSection: r.learnSection, learn: r.learn });
  };
  const saveSteps = async () => {
    const r = await apiPatch<SiteContent>("/site-content", { accessSteps: st.accessSteps.map((s, i) => ({ ...s, n: i + 1 })) });
    set({ accessSteps: r.accessSteps });
  };
  const saveFaq = async () => { const r = await apiPatch<SiteContent>("/site-content", { faq: st.faq }); set({ faq: r.faq }); };
  const saveContact = async () => { const r = await apiPatch<SiteContent>("/site-content", { contact: st.contact }); set({ contact: r.contact }); };
  const saveTerms = async () => { const r = await apiPatch<SiteContent>("/site-content", { terms: st.terms }); set({ terms: r.terms }); };
  const saveFooter = async () => { const r = await apiPatch<SiteContent>("/site-content", { footerText: st.footerText }); set({ footerText: r.footerText }); };
  const savePlans = async () => {
    for (const p of plans) {
      await apiPatch<Plan>(`/plans/${p.key}`, { name: p.name, period: p.period, prices: p.prices });
    }
    const fresh = await apiGet<Plan[]>("/plans");
    setPlans([...fresh].sort((a, b) => a.order - b.order));
  };

  return (
    <>
      <AdminHead title="المحتوى العام" sub="تعديل النصوص والإحصاءات والأسعار الظاهرة في الموقع" />

      {/* ١) قسم البطل */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>قسم البطل (Hero)</h3>
        <AArea label="العنوان الرئيسي" value={st.hero.title} onChange={(e) => set({ hero: { ...st.hero, title: e.target.value } })} rows={2} />
        <AArea label="النص التعريفي" value={st.hero.sub} onChange={(e) => set({ hero: { ...st.hero, sub: e.target.value } })} rows={3} />
        <SaveBar onSave={saveHero}>حفظ قسم البطل</SaveBar>
      </ACard>

      {/* ٢) بيانات الأستاذ */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>بيانات الأستاذ</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="admin-2col">
          <AInput label="الاسم" value={ins.name} onChange={(e) => setIns({ name: e.target.value })} />
          <AInput label="الصفة" value={ins.title} onChange={(e) => setIns({ title: e.target.value })} />
        </div>
        <AArea label="نبذة مختصرة" value={ins.short} onChange={(e) => setIns({ short: e.target.value })} rows={2} />
        <div style={subHead}>السيرة (فقرات)</div>
        {ins.bio.map((b, i) => (
          <AArea key={i} value={b} onChange={(e) => setIns({ bio: updAt(ins.bio, i, e.target.value) })} rows={2} />
        ))}
        <div style={subHead}>المؤهّلات</div>
        {ins.credentials.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <AInput value={c} onChange={(e) => setIns({ credentials: updAt(ins.credentials, i, e.target.value) })} />
            </div>
            <button
              title="حذف"
              onClick={() => { if (confirmDel("حذف هذا المؤهّل؟")) setIns({ credentials: rmAt(ins.credentials, i) }); }}
              style={{ ...delSm, marginTop: "7px" }}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => setIns({ credentials: [...ins.credentials, ""] })} style={addLink}>＋ إضافة مؤهّل</button>
        </div>
        <div style={{ ...subHead, margin: "8px 0 10px" }}>الإحصاءات المعروضة</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }} className="admin-2col">
          {ins.stats.map((s, i) => (
            <div key={i} style={{ background: "var(--panel)", borderRadius: "11px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ width: "80px" }}>
                <span style={lbl}>القيمة</span>
                <input value={s.value} onChange={(e) => setStat(i, "value", e.target.value)} type="number" style={miniInput} />
              </div>
              <div style={{ width: "56px" }}>
                <span style={lbl}>لاحقة</span>
                <input value={s.suffix} onChange={(e) => setStat(i, "suffix", e.target.value)} style={{ ...miniInput, direction: "ltr" }} />
              </div>
              <div style={{ flexGrow: 1 }}>
                <span style={lbl}>الوصف</span>
                <input value={s.label} onChange={(e) => setStat(i, "label", e.target.value)} style={miniInput} />
              </div>
            </div>
          ))}
        </div>
        <SaveBar onSave={saveIns}>حفظ بيانات الأستاذ</SaveBar>
      </ACard>

      {/* ٣) الباقات والأسعار */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>الباقات والأسعار</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
          {plans.map((p, i) => (
            <div key={p.key} style={panelBox}>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "10px", marginBottom: "8px" }} className="admin-2col">
                <div>
                  <span style={lbl}>اسم الباقة</span>
                  <input value={p.name} onChange={(e) => setPlan(i, { name: e.target.value })} style={miniInput9} />
                </div>
                <div>
                  <span style={lbl}>المدة</span>
                  <input value={p.period} onChange={(e) => setPlan(i, { period: e.target.value })} style={miniInput9} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {PRICE_FIELDS.map(([k, l]) => (
                  <div key={k}>
                    <span style={lbl}>{l}</span>
                    <input
                      type="number"
                      value={p.prices[k]}
                      onChange={(e) => setPlan(i, { prices: { ...p.prices, [k]: Number(e.target.value) || 0 } })}
                      style={{ ...miniInput9, direction: "ltr", textAlign: "right" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SaveBar onSave={savePlans}>حفظ الأسعار</SaveBar>
      </ACard>

      {/* ٤) لماذا المنصة */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>لماذا المنصة</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="admin-2col">
          {st.why.map((w, i) => (
            <div key={i} style={{ background: "var(--panel)", borderRadius: "11px", padding: "12px" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "8px" }}>
                <div style={{ width: "56px" }}>
                  <span style={lbl}>الرمز</span>
                  <input value={w.glyph} onChange={(e) => set({ why: updAt(st.why, i, { ...w, glyph: e.target.value }) })} style={{ ...miniInput, textAlign: "center" }} />
                </div>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <span style={lbl}>العنوان</span>
                  <input value={w.title} onChange={(e) => set({ why: updAt(st.why, i, { ...w, title: e.target.value }) })} style={miniInput} />
                </div>
                <button
                  title="حذف"
                  onClick={() => { if (confirmDel("حذف هذه البطاقة؟")) set({ why: rmAt(st.why, i) }); }}
                  style={{ ...delSm, marginBottom: "2px" }}
                >
                  <Icon name="x" size={14} />
                </button>
              </div>
              <span style={lbl}>النص</span>
              <textarea rows={3} value={w.text} onChange={(e) => set({ why: updAt(st.why, i, { ...w, text: e.target.value }) })} style={{ ...miniArea, padding: "8px" }} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => set({ why: [...st.why, { glyph: "✦", title: "", text: "" }] })} style={addLink}>＋ إضافة بطاقة</button>
        </div>
        <SaveBar onSave={saveWhy}>حفظ لماذا المنصة</SaveBar>
      </ACard>

      {/* ٥) قسم ماذا ستتعلّم */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>قسم ماذا ستتعلّم</h3>
        <AArea label="العنوان" value={st.learnSection.title} onChange={(e) => set({ learnSection: { ...st.learnSection, title: e.target.value } })} rows={2} />
        <AArea label="النص" value={st.learnSection.text} onChange={(e) => set({ learnSection: { ...st.learnSection, text: e.target.value } })} rows={3} />
        <AArea label="الاقتباس" value={st.learnSection.quote} onChange={(e) => set({ learnSection: { ...st.learnSection, quote: e.target.value } })} rows={2} />
        <div style={subHead}>عناصر التعلّم</div>
        {st.learn.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <AInput value={l} onChange={(e) => set({ learn: updAt(st.learn, i, e.target.value) })} />
            </div>
            <button
              title="حذف"
              onClick={() => { if (confirmDel("حذف هذا العنصر؟")) set({ learn: rmAt(st.learn, i) }); }}
              style={{ ...delSm, marginTop: "7px" }}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => set({ learn: [...st.learn, ""] })} style={addLink}>＋ إضافة عنصر</button>
        </div>
        <SaveBar onSave={saveLearn}>حفظ قسم ماذا ستتعلّم</SaveBar>
      </ACard>

      {/* ٦) خطوات الوصول */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>خطوات الوصول</h3>
        {st.accessSteps.map((s, i) => (
          <div key={i} style={{ ...panelBox, marginBottom: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div className="serif" style={{ width: 34, height: 34, borderRadius: "999px", background: "rgba(191,145,64,.14)", color: "var(--gold-400)", fontWeight: 800, fontSize: "15px", display: "grid", placeItems: "center", flexShrink: 0, marginTop: "18px" }}>
              {arNum(i + 1)}
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <span style={lbl}>عنوان الخطوة</span>
              <input value={s.title} onChange={(e) => set({ accessSteps: updAt(st.accessSteps, i, { ...s, title: e.target.value }) })} style={{ ...miniInput9, marginBottom: "8px" }} />
              <span style={lbl}>النص</span>
              <textarea rows={2} value={s.text} onChange={(e) => set({ accessSteps: updAt(st.accessSteps, i, { ...s, text: e.target.value }) })} style={miniArea} />
            </div>
            <button
              title="حذف"
              onClick={() => { if (confirmDel("حذف هذه الخطوة؟")) set({ accessSteps: rmAt(st.accessSteps, i) }); }}
              style={{ ...delSm, marginTop: "20px" }}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => set({ accessSteps: [...st.accessSteps, { n: st.accessSteps.length + 1, title: "", text: "" }] })} style={addLink}>＋ إضافة خطوة</button>
        </div>
        <SaveBar onSave={saveSteps}>حفظ خطوات الوصول</SaveBar>
      </ACard>

      {/* ٧) الأسئلة الشائعة */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>الأسئلة الشائعة</h3>
        {st.faq.map((f, i) => (
          <div key={i} style={{ ...panelBox, marginBottom: "10px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0, marginTop: "20px" }}>
              <button
                onClick={() => { if (i > 0) set({ faq: swapAt(st.faq, i, i - 1) }); }}
                disabled={i === 0}
                title="تحريك لأعلى"
                style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === 0 ? "#2a4863" : "var(--text-mute)", cursor: i === 0 ? "default" : "pointer" }}
              >
                <Icon name="up" size={14} />
              </button>
              <button
                onClick={() => { if (i < st.faq.length - 1) set({ faq: swapAt(st.faq, i, i + 1) }); }}
                disabled={i === st.faq.length - 1}
                title="تحريك لأسفل"
                style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === st.faq.length - 1 ? "#2a4863" : "var(--text-mute)", cursor: i === st.faq.length - 1 ? "default" : "pointer" }}
              >
                <Icon name="down" size={14} />
              </button>
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <span style={lbl}>السؤال</span>
              <input value={f.q} onChange={(e) => set({ faq: updAt(st.faq, i, { ...f, q: e.target.value }) })} style={{ ...miniInput9, marginBottom: "8px" }} />
              <span style={lbl}>الإجابة</span>
              <textarea rows={3} value={f.a} onChange={(e) => set({ faq: updAt(st.faq, i, { ...f, a: e.target.value }) })} style={miniArea} />
            </div>
            <button
              title="حذف"
              onClick={() => { if (confirmDel("حذف هذا السؤال؟")) set({ faq: rmAt(st.faq, i) }); }}
              style={{ ...delSm, marginTop: "20px" }}
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => set({ faq: [...st.faq, { q: "", a: "" }] })} style={addLink}>＋ إضافة سؤال</button>
        </div>
        <SaveBar onSave={saveFaq}>حفظ الأسئلة الشائعة</SaveBar>
      </ACard>

      {/* ٨) بيانات التواصل */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>بيانات التواصل</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }} className="admin-selectors">
          <AInput label="البريد الإلكتروني" value={st.contact.email} onChange={(e) => set({ contact: { ...st.contact, email: e.target.value } })} mono />
          <AInput label="واتساب" value={st.contact.whatsapp} onChange={(e) => set({ contact: { ...st.contact, whatsapp: e.target.value } })} mono />
          <AInput label="الهاتف" value={st.contact.phone} onChange={(e) => set({ contact: { ...st.contact, phone: e.target.value } })} mono />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }} className="admin-selectors">
          <AInput label="رابط صفحة فيسبوك" value={st.contact.facebook ?? ""} onChange={(e) => set({ contact: { ...st.contact, facebook: e.target.value } })} mono />
          <AInput label="رابط واتساب (QR)" value={st.contact.whatsappQr ?? ""} onChange={(e) => set({ contact: { ...st.contact, whatsappQr: e.target.value } })} mono />
        </div>
        <SaveBar onSave={saveContact}>حفظ بيانات التواصل</SaveBar>
      </ACard>

      {/* ٩) الشروط والخصوصية */}
      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={h3Style}>الشروط والخصوصية</h3>
        {st.terms.map((t, i) => (
          <div key={i} style={{ ...panelBox, marginBottom: "10px" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "8px" }}>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <span style={lbl}>العنوان</span>
                <input value={t.title} onChange={(e) => set({ terms: updAt(st.terms, i, { ...t, title: e.target.value }) })} style={miniInput9} />
              </div>
              <button
                title="حذف"
                onClick={() => { if (confirmDel("حذف هذا القسم؟")) set({ terms: rmAt(st.terms, i) }); }}
                style={{ ...delSm, marginBottom: "2px" }}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
            <span style={lbl}>النص</span>
            <textarea rows={4} value={t.body} onChange={(e) => set({ terms: updAt(st.terms, i, { ...t, body: e.target.value }) })} style={miniArea} />
          </div>
        ))}
        <div style={{ marginBottom: "14px" }}>
          <button onClick={() => set({ terms: [...st.terms, { title: "", body: "" }] })} style={addLink}>＋ إضافة قسم</button>
        </div>
        <SaveBar onSave={saveTerms}>حفظ الشروط والخصوصية</SaveBar>
      </ACard>

      {/* ١٠) نص التذييل */}
      <ACard>
        <h3 style={h3Style}>نص التذييل</h3>
        <AArea label="النص" value={st.footerText} onChange={(e) => set({ footerText: e.target.value })} rows={2} />
        <SaveBar onSave={saveFooter}>حفظ نص التذييل</SaveBar>
      </ACard>
    </>
  );
}
