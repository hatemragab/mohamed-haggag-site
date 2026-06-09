"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AArea,
  ABtn,
  ACard,
  AdminHead,
  AInput,
  AModal,
  ASelect,
  confirmDel,
  Icon,
} from "@/components/admin-ui";
import { apiDelete, ApiError, apiGet, apiPatch, apiPost } from "@/lib/client";
import { arNum, type CategoryDetail, type CategoryListItem, type LevelWithLessons } from "@/lib/types";

const LEVELS = ["تأسيسي", "مدرسي", "أزهري", "متدرّج", "قرآني"];

const errMsg = (e: unknown): string =>
  e instanceof ApiError ? e.message : "حدث خطأ غير متوقع";

interface CatForm {
  title: string;
  tagline: string;
  desc: string;
  glyph: string;
  level: string;
}

const blank: CatForm = { title: "", tagline: "", desc: "", glyph: "✦", level: "مدرسي" };

type EditState = { mode: "new" } | { mode: "edit"; cat: CategoryListItem };

// ---- الأقسام والمستويات ----
export default function CategoriesClient() {
  const [cats, setCats] = useState<CategoryListItem[] | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [listErr, setListErr] = useState<string | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [subsFor, setSubsFor] = useState<CategoryListItem | null>(null);
  const [form, setForm] = useState<CatForm>(blank);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadErr(null);
    try {
      setCats(await apiGet<CategoryListItem[]>("/categories"));
    } catch (e) {
      setLoadErr(errMsg(e));
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openNew = () => { setForm(blank); setFormErr(null); setEdit({ mode: "new" }); };
  const openEdit = (c: CategoryListItem) => {
    setForm({ title: c.title, tagline: c.tagline, desc: c.desc, glyph: c.glyph, level: c.level });
    setFormErr(null);
    setEdit({ mode: "edit", cat: c });
  };

  const commit = async () => {
    if (!form.title.trim() || !edit || saving) return;
    setSaving(true);
    setFormErr(null);
    try {
      if (edit.mode === "new") await apiPost<unknown>("/categories", form);
      else await apiPatch<unknown>(`/categories/${edit.cat.id}`, form);
      setEdit(null);
      await load();
    } catch (e) {
      setFormErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const del = async (c: CategoryListItem) => {
    if (!confirmDel(`حذف قسم «${c.title}» وكل مستوياته؟`)) return;
    setListErr(null);
    try {
      await apiDelete<unknown>(`/categories/${c.id}`);
      setCats((prev) => (prev ? prev.filter((x) => x.id !== c.id) : prev));
    } catch (e) {
      setListErr(errMsg(e));
    }
  };

  /** بعد تعديل المستويات داخل النافذة: حدّث عدّاد المستويات في القائمة */
  const onSubsChanged = (d: CategoryDetail) => {
    const count = d.groups
      ? d.groups.reduce((a, g) => a + g.levels.length, 0)
      : d.levels.length;
    setCats((prev) =>
      prev ? prev.map((c) => (c.id === d.id ? { ...c, levelsCount: count } : c)) : prev,
    );
  };

  if (cats === null) {
    if (loadErr)
      return (
        <>
          <AdminHead title="الأقسام والمستويات" />
          <ACard style={{ textAlign: "center" }}>
            <div style={{ color: "var(--bad)", fontSize: "14.5px", marginBottom: "14px" }}>{loadErr}</div>
            <ABtn tone="ghost" onClick={() => void load()}>إعادة المحاولة</ABtn>
          </ACard>
        </>
      );
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );
  }

  return (
    <>
      <AdminHead
        title="الأقسام والمستويات"
        sub={`${arNum(cats.length)} قسم رئيسي`}
        action={<ABtn icon="layers" onClick={openNew}>إضافة قسم</ABtn>}
      />
      {listErr && (
        <div style={{ color: "var(--bad)", fontSize: "13.5px", marginBottom: "14px" }}>{listErr}</div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cats.map((c) => (
          <ACard key={c.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ width: 54, height: 54, borderRadius: "15px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span className="serif" style={{ fontSize: "26px" }}>{c.glyph}</span>
            </span>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>{c.title}</span>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--gold-400)", background: "rgba(191,145,64,.14)", padding: "3px 10px", borderRadius: "999px" }}>{c.level}</span>
              </div>
              <div style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "3px" }}>{c.tagline} · {arNum(c.levelsCount)} مستوى</div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <ABtn size="sm" tone="ghost" icon="layers" onClick={() => setSubsFor(c)}>المستويات</ABtn>
              <ABtn size="sm" tone="outline" icon="book" onClick={() => openEdit(c)}>تعديل</ABtn>
              <button onClick={() => void del(c)} style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center" }}>
                <Icon name="x" size={17} />
              </button>
            </div>
          </ACard>
        ))}
      </div>

      {edit && (
        <AModal title={edit.mode === "new" ? "إضافة قسم جديد" : "تعديل القسم"} onClose={() => setEdit(null)}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flexShrink: 0, width: "84px" }}>
              <AInput label="الرمز" value={form.glyph} onChange={(e) => setForm({ ...form, glyph: e.target.value })} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <AInput label="اسم القسم" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: تأسيس القراءة" />
            </div>
          </div>
          <AInput label="العنوان الفرعي" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="وصف قصير مميّز" />
          <AArea label="الوصف" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} />
          <ASelect label="المستوى" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} options={LEVELS.map((l) => ({ v: l, l }))} />
          {formErr && (
            <div style={{ color: "var(--bad)", fontSize: "13px", marginBottom: "10px" }}>{formErr}</div>
          )}
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <ABtn full onClick={() => void commit()} icon="check" disabled={saving}>حفظ</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}

      {subsFor && (
        <SubsModal cat={subsFor} onClose={() => setSubsFor(null)} onChanged={onSubsChanged} />
      )}
    </>
  );
}

interface GroupView {
  key: string | null;
  title: string | null;
  levels: LevelWithLessons[];
}

// إدارة المستويات (الساب-كاتيجوريز) داخل قسم
function SubsModal({
  cat,
  onClose,
  onChanged,
}: {
  cat: CategoryListItem;
  onClose: () => void;
  onChanged: (d: CategoryDetail) => void;
}) {
  const [detail, setDetail] = useState<CategoryDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [adding, setAdding] = useState<string | null>(null); // group key (أو "main")
  const [val, setVal] = useState({ title: "", note: "" });

  const loadDetail = useCallback(async () => {
    setErr(null);
    try {
      setDetail(await apiGet<CategoryDetail>(`/categories/${cat.slug}`));
    } catch (e) {
      setErr(errMsg(e));
    }
  }, [cat.slug]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const groups: GroupView[] = detail
    ? detail.groups
      ? detail.groups.map((g) => ({ key: g.key, title: g.title, levels: g.levels }))
      : [{ key: null, title: null, levels: detail.levels }]
    : [];

  const apply = (d: CategoryDetail) => {
    setDetail(d);
    onChanged(d);
  };

  const addSub = async (groupKey: string | null) => {
    if (!val.title.trim()) return;
    setErr(null);
    try {
      const d = await apiPost<CategoryDetail>(`/categories/${cat.id}/levels`, {
        ...(groupKey ? { groupKey } : {}),
        title: val.title,
        note: val.note,
      });
      apply(d);
      setVal({ title: "", note: "" });
      setAdding(null);
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const delSub = async (groupKey: string | null, levelKey: string) => {
    setErr(null);
    try {
      const d = await apiDelete<CategoryDetail>(
        `/categories/${cat.id}/levels/${levelKey}${groupKey ? `?groupKey=${encodeURIComponent(groupKey)}` : ""}`,
      );
      apply(d);
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  const renSub = async (groupKey: string | null, levelKey: string, title: string) => {
    setErr(null);
    try {
      const d = await apiPatch<CategoryDetail>(`/categories/${cat.id}/levels/${levelKey}`, {
        ...(groupKey ? { groupKey } : {}),
        title,
      });
      apply(d);
    } catch (e) {
      setErr(errMsg(e));
    }
  };

  return (
    <AModal title={`مستويات: ${cat.title}`} onClose={onClose} wide>
      {err && (
        <div style={{ color: "var(--bad)", fontSize: "13px", marginBottom: "12px" }}>{err}</div>
      )}
      {!detail ? (
        err ? (
          <ABtn tone="ghost" onClick={() => void loadDetail()}>إعادة المحاولة</ABtn>
        ) : (
          <div style={{ display: "grid", placeItems: "center", padding: "30px 0" }}>
            <div className="ring" />
          </div>
        )
      ) : (
        groups.map((g) => {
          const gid = g.key ?? "main";
          return (
            <div key={gid} style={{ marginBottom: "18px" }}>
              {g.title && (
                <div style={{ color: "var(--gold-400)", fontWeight: 800, fontSize: "15px", marginBottom: "10px" }}>{g.title}</div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                {g.levels.map((s) => (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "var(--panel)", borderRadius: "10px" }}>
                    <Icon name="book" size={16} style={{ color: "var(--text-dim)", flexShrink: 0 }} />
                    <input
                      key={s.title}
                      defaultValue={s.title}
                      onBlur={(e) => {
                        if (e.target.value !== s.title) void renSub(g.key, s.key, e.target.value);
                      }}
                      style={{ flexGrow: 1, background: "transparent", border: "none", color: "#fff", fontSize: "14px", outline: "none", fontWeight: 600 }}
                    />
                    {s.note && (
                      <span style={{ color: "var(--text-dim)", fontSize: "11.5px", flexShrink: 0 }}>{s.note}</span>
                    )}
                    <button onClick={() => void delSub(g.key, s.key)} style={{ color: "var(--bad)", flexShrink: 0 }}>
                      <Icon name="x" size={15} />
                    </button>
                  </div>
                ))}
              </div>
              {adding === gid ? (
                <div style={{ display: "flex", gap: "8px", marginTop: "9px", alignItems: "flex-start" }}>
                  <div style={{ flexGrow: 1 }}>
                    <input
                      autoFocus
                      value={val.title}
                      onChange={(e) => setVal({ ...val, title: e.target.value })}
                      placeholder="اسم المستوى"
                      style={{ width: "100%", background: "var(--panel)", border: "1.5px solid var(--gold)", borderRadius: "9px", padding: "9px 12px", color: "#fff", fontSize: "13.5px", outline: "none", marginBottom: "6px" }}
                    />
                    <input
                      value={val.note}
                      onChange={(e) => setVal({ ...val, note: e.target.value })}
                      placeholder="ملاحظة (اختياري)"
                      style={{ width: "100%", background: "var(--panel)", border: "1.5px solid var(--line-dark)", borderRadius: "9px", padding: "8px 12px", color: "#fff", fontSize: "12.5px", outline: "none" }}
                    />
                  </div>
                  <ABtn size="sm" icon="check" onClick={() => void addSub(g.key)}>إضافة</ABtn>
                </div>
              ) : (
                <button
                  onClick={() => { setAdding(gid); setVal({ title: "", note: "" }); }}
                  style={{ marginTop: "9px", color: "var(--gold-400)", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  ＋ إضافة مستوى{g.title ? ` إلى ${g.title}` : ""}
                </button>
              )}
            </div>
          );
        })
      )}
    </AModal>
  );
}
