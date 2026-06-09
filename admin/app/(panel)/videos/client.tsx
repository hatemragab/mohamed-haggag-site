"use client";

import { useEffect, useRef, useState } from "react";
import {
  ABtn,
  ACard,
  AdminHead,
  AInput,
  AModal,
  ASelect,
  AToggle,
  confirmDel,
  Icon,
} from "@/components/admin-ui";
import { ApiError, apiDelete, apiGet, apiPatch, apiPost } from "@/lib/client";
import type { AdminLesson, CategoryDetail, CategoryListItem } from "@/lib/types";
import { arNum } from "@/lib/types";
import { isValidYtId, ytId, ytThumb } from "@/lib/youtube";

/* ---- الفيديوهات والدروس ---- */

type LessonForm = { title: string; youtube: string; duration: string | number; free: boolean };
type EditState = { mode: "new" } | { mode: "edit"; lesson: AdminLesson };

const BLANK: LessonForm = { title: "", youtube: "", duration: 20, free: false };

const errMsg = (e: unknown) =>
  e instanceof ApiError ? e.message : "حدث خطأ غير متوقع";

export default function VideosClient() {
  /* الأقسام */
  const [cats, setCats] = useState<CategoryListItem[] | null>(null);
  const [bootErr, setBootErr] = useState("");
  const [bootTick, setBootTick] = useState(0);
  const [catId, setCatId] = useState("");

  /* شجرة المستويات للقسم المختار */
  const [detail, setDetail] = useState<CategoryDetail | null>(null);
  const [detailErr, setDetailErr] = useState("");
  const [detailTick, setDetailTick] = useState(0);
  const [groupKey, setGroupKey] = useState("");
  const [levelKey, setLevelKey] = useState("");

  /* الدروس */
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [listErr, setListErr] = useState("");
  const [lessonsTick, setLessonsTick] = useState(0);
  const [fetchedFor, setFetchedFor] = useState("");

  /* النوافذ */
  const [edit, setEdit] = useState<EditState | null>(null);
  const [preview, setPreview] = useState<AdminLesson | null>(null);
  const [form, setForm] = useState<LessonForm>(BLANK);
  const [modalErr, setModalErr] = useState("");
  const [saving, setSaving] = useState(false);
  const movingRef = useRef(false);

  /* تحميل الأقسام */
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await apiGet<CategoryListItem[]>("/categories");
        if (!alive) return;
        setCats(list);
        setCatId((cur) => cur || (list[0]?.id ?? ""));
      } catch (e) {
        if (alive) setBootErr(errMsg(e));
      }
    })();
    return () => {
      alive = false;
    };
  }, [bootTick]);

  const retryBoot = () => {
    setBootErr("");
    setCats(null);
    setBootTick((t) => t + 1);
  };

  /* تحميل تفاصيل القسم (المجموعات والمستويات) */
  useEffect(() => {
    if (!catId || !cats) return;
    const cat = cats.find((c) => c.id === catId);
    if (!cat) return;
    let alive = true;
    (async () => {
      try {
        const d = await apiGet<CategoryDetail>(`/categories/${cat.slug}`);
        if (!alive) return;
        setDetail(d);
        const g = d.groups && d.groups.length > 0 ? d.groups[0] : null;
        setGroupKey(g ? g.key : "");
        const lv = g ? g.levels : d.levels;
        setLevelKey(lv[0]?.key ?? "");
      } catch (e) {
        if (alive) setDetailErr(errMsg(e));
      }
    })();
    return () => {
      alive = false;
    };
  }, [catId, cats, detailTick]);

  const retryDetail = () => {
    setDetail(null);
    setDetailErr("");
    setDetailTick((t) => t + 1);
  };

  /* تحميل الدروس عند اكتمال المحدّدات */
  const lessonsKey =
    catId && levelKey ? `${catId}|${groupKey}|${levelKey}|${lessonsTick}` : "";
  useEffect(() => {
    if (!lessonsKey) return;
    const [cid, gk, lk] = lessonsKey.split("|");
    let alive = true;
    (async () => {
      try {
        const qs = new URLSearchParams({ categoryId: cid, levelKey: lk });
        if (gk) qs.set("groupKey", gk);
        const list = await apiGet<AdminLesson[]>(`/lessons?${qs.toString()}`);
        if (!alive) return;
        setLessons(list);
        setListErr("");
      } catch (e) {
        if (alive) setListErr(errMsg(e));
      } finally {
        if (alive) setFetchedFor(lessonsKey);
      }
    })();
    return () => {
      alive = false;
    };
  }, [lessonsKey]);

  /* عند تغيير القسم */
  const changeCat = (id: string) => {
    setCatId(id);
    setDetail(null);
    setDetailErr("");
    setGroupKey("");
    setLevelKey("");
    setLessons([]);
    setListErr("");
  };
  const changeGroup = (gk: string) => {
    setGroupKey(gk);
    const g = detail?.groups?.find((x) => x.key === gk);
    setLevelKey(g?.levels[0]?.key ?? "");
    setLessons([]);
    setListErr("");
  };
  const changeLevel = (lk: string) => {
    setLevelKey(lk);
    setLessons([]);
    setListErr("");
  };

  const hasGroups = !!detail?.groups && detail.groups.length > 0;
  const groups = detail?.groups ?? [];
  const levels = hasGroups
    ? groups.find((g) => g.key === groupKey)?.levels ?? []
    : detail?.levels ?? [];
  const level = levels.find((s) => s.key === levelKey);
  const treeLoading = !!catId && !detail && !detailErr;
  const lessonsLoading = !!lessonsKey && fetchedFor !== lessonsKey && !listErr;

  const commit = async () => {
    if (!form.title.trim() || !edit) return;
    setSaving(true);
    setModalErr("");
    try {
      if (edit.mode === "new") {
        const created = await apiPost<AdminLesson>("/lessons", {
          categoryId: catId,
          ...(groupKey ? { groupKey } : {}),
          levelKey,
          title: form.title,
          youtube: form.youtube,
          durationMinutes: Number(form.duration) || 0,
          free: form.free,
        });
        setLessons((cur) => [...cur, created]);
      } else {
        const updated = await apiPatch<AdminLesson>(`/lessons/${edit.lesson.id}`, {
          title: form.title,
          youtube: form.youtube,
          durationMinutes: Number(form.duration) || 0,
          free: form.free,
        });
        setLessons((cur) => cur.map((x) => (x.id === updated.id ? updated : x)));
      }
      setEdit(null);
    } catch (e) {
      setModalErr(errMsg(e));
    } finally {
      setSaving(false);
    }
  };

  const del = async (l: AdminLesson) => {
    if (!confirmDel(`حذف درس «${l.title}»؟`)) return;
    setListErr("");
    try {
      await apiDelete<unknown>(`/lessons/${l.id}`);
      setLessonsTick((t) => t + 1);
    } catch (e) {
      setListErr(errMsg(e));
    }
  };

  const move = async (l: AdminLesson, dir: -1 | 1) => {
    if (movingRef.current) return;
    const i = lessons.findIndex((x) => x.id === l.id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= lessons.length) return;
    const ids = lessons.map((x) => x.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    movingRef.current = true;
    setListErr("");
    try {
      const fresh = await apiPatch<AdminLesson[]>("/lessons/reorder", {
        categoryId: catId,
        ...(groupKey ? { groupKey } : {}),
        levelKey,
        orderedIds: ids,
      });
      setLessons(fresh);
    } catch (e) {
      setListErr(errMsg(e));
    } finally {
      movingRef.current = false;
    }
  };

  const openNew = () => {
    setForm({ ...BLANK });
    setModalErr("");
    setEdit({ mode: "new" });
  };
  const openEdit = (l: AdminLesson) => {
    setForm({ title: l.title, youtube: l.youtubeId, duration: l.durationMinutes, free: l.free });
    setModalErr("");
    setEdit({ mode: "edit", lesson: l });
  };

  const vid = ytId(form.youtube);
  const validVid = isValidYtId(form.youtube);

  if (bootErr)
    return (
      <>
        <AdminHead title="الفيديوهات والدروس" sub="اختر القسم والمستوى لإدارة دروسه وروابط يوتيوب" />
        <ACard>
          <div style={{ display: "grid", gap: "14px", justifyItems: "center", padding: "30px 10px", textAlign: "center" }}>
            <div style={{ color: "var(--bad)", fontSize: "14px" }}>{bootErr}</div>
            <ABtn tone="outline" onClick={retryBoot}>إعادة المحاولة</ABtn>
          </div>
        </ACard>
      </>
    );

  if (!cats)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  return (
    <>
      <AdminHead
        title="الفيديوهات والدروس"
        sub="اختر القسم والمستوى لإدارة دروسه وروابط يوتيوب"
        action={level ? <ABtn icon="play" onClick={openNew}>إضافة درس</ABtn> : undefined}
      />

      {/* إرشاد سريع لسير العمل عبر يوتيوب */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(191,145,64,.08)", border: "1px solid rgba(191,145,64,.25)", borderRadius: "12px", padding: "13px 16px", marginBottom: "18px", color: "var(--text-soft)", fontSize: "13px", lineHeight: 1.8 }}>
        <Icon name="shield" size={17} style={{ color: "var(--gold-400)", flexShrink: 0, marginTop: "4px" }} />
        <span>ارفع الفيديو على قناتك في يوتيوب بخصوصية <b style={{ color: "var(--gold-400)" }}>«غير مُدرج»</b> مع السماح بالتضمين، ثم الصق رابطه هنا — لن يظهر في بحث يوتيوب وسيُعرض داخل المنصة فقط. استخدم زر المعاينة ▶ بجانب أي درس للتأكد أن التشغيل يعمل.</span>
      </div>

      {/* المحدّدات */}
      <ACard style={{ marginBottom: "18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: hasGroups ? "1fr 1fr 1fr" : "1fr 1fr", gap: "12px" }} className="admin-selectors">
          <ASelect label="القسم" value={catId} onChange={(e) => changeCat(e.target.value)} options={cats.map((c) => ({ v: c.id, l: c.title }))} />
          {hasGroups && <ASelect label="المجموعة" value={groupKey} onChange={(e) => changeGroup(e.target.value)} options={groups.map((g) => ({ v: g.key, l: g.title }))} />}
          <ASelect label="المستوى" value={levelKey} onChange={(e) => changeLevel(e.target.value)} options={levels.map((s) => ({ v: s.key, l: s.title }))} />
        </div>
        {detailErr && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ color: "var(--bad)", fontSize: "13px" }}>{detailErr}</span>
            <ABtn size="sm" tone="outline" onClick={retryDetail}>إعادة المحاولة</ABtn>
          </div>
        )}
      </ACard>

      {/* قائمة الدروس */}
      <ACard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px" }}>{level ? `دروس: ${level.title}` : "—"}</h3>
          <span style={{ color: "var(--text-dim)", fontSize: "13px" }}>{arNum(lessons.length)} درس</span>
        </div>
        {listErr && (
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ color: "var(--bad)", fontSize: "13px" }}>{listErr}</span>
            <ABtn size="sm" tone="outline" onClick={() => { setListErr(""); setLessonsTick((t) => t + 1); }}>إعادة المحاولة</ABtn>
          </div>
        )}
        {treeLoading || lessonsLoading ? (
          <div style={{ display: "grid", placeItems: "center", padding: "30px" }}>
            <div className="ring" style={{ width: 34, height: 34 }} />
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {lessons.map((l, li) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: "13px", padding: "12px 14px", background: "var(--panel)", borderRadius: "11px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0 }}>
                  <button onClick={() => void move(l, -1)} disabled={li === 0} title="تحريك لأعلى" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: li === 0 ? "#2a4863" : "var(--text-mute)", cursor: li === 0 ? "default" : "pointer" }}><Icon name="up" size={14} /></button>
                  <button onClick={() => void move(l, 1)} disabled={li === lessons.length - 1} title="تحريك لأسفل" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: li === lessons.length - 1 ? "#2a4863" : "var(--text-mute)", cursor: li === lessons.length - 1 ? "default" : "pointer" }}><Icon name="down" size={14} /></button>
                </div>
                <span style={{ width: 30, height: 30, borderRadius: "9px", background: "var(--navy-700)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 800, fontSize: "13px" }}>{arNum(l.order)}</span>
                {ytThumb(l.youtubeId) && <img src={ytThumb(l.youtubeId)} alt="" loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} style={{ width: 66, height: 40, borderRadius: "8px", objectFit: "cover", flexShrink: 0, background: "var(--navy-700)" }} className="vid-thumb" />}
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ color: "#fff", fontSize: "14.5px", fontWeight: 700 }}>{l.title}</div>
                  <div style={{ display: "flex", gap: "12px", marginTop: "2px", flexWrap: "wrap" }}>
                    <span style={{ color: "var(--text-dim)", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}><Icon name="clock" size={12} /> {arNum(l.durationMinutes)} د</span>
                    <span style={{ color: "#6fa8d0", fontSize: "11.5px", fontFamily: "ui-monospace,monospace", direction: "ltr" }}>{l.youtubeId || "—"}</span>
                  </div>
                </div>
                {l.free && <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--ok)", background: "rgba(63,125,94,.18)", padding: "3px 9px", borderRadius: "999px", flexShrink: 0 }}>مجاني</span>}
                <button onClick={() => setPreview(l)} title="معاينة التشغيل" style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(191,145,64,.14)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="play" size={15} /></button>
                <button onClick={() => openEdit(l)} title="تعديل" style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "var(--text-soft)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="book" size={16} /></button>
                <button onClick={() => void del(l)} title="حذف" style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "var(--bad)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="x" size={16} /></button>
              </div>
            ))}
            {lessons.length === 0 && !listErr && <div style={{ color: "var(--text-dim)", textAlign: "center", padding: "30px", fontSize: "14px" }}>لا توجد دروس بعد — أضف أول درس.</div>}
          </div>
        )}
      </ACard>

      {edit && (
        <AModal title={edit.mode === "new" ? "إضافة درس" : "تعديل الدرس"} onClose={() => setEdit(null)}>
          <AInput label="عنوان الدرس" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: مدخل وتمهيد" />
          <AInput label="رابط يوتيوب أو المُعرّف" value={form.youtube} onChange={(e) => setForm({ ...form, youtube: e.target.value })} placeholder="https://youtu.be/XXXXXXXXXXX" mono />
          {validVid ? (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", background: "var(--panel)", borderRadius: "11px", padding: "10px", marginTop: "-8px", marginBottom: "14px" }}>
              <img src={ytThumb(vid)} alt="" onError={(e) => (e.currentTarget.style.display = "none")} style={{ width: 96, height: 54, borderRadius: "8px", objectFit: "cover", background: "var(--navy-700)", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "var(--ok)", fontSize: "12.5px", fontWeight: 700, display: "flex", gap: "6px", alignItems: "center" }}><Icon name="check" size={14} stroke={2.4} /> تم التعرّف على الفيديو</div>
                <div style={{ color: "#6fa8d0", fontSize: "11.5px", fontFamily: "ui-monospace,monospace", direction: "ltr", textAlign: "right" }}>{vid}</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "11.5px", color: form.youtube ? "var(--bad)" : "var(--text-dim)", marginTop: "-8px", marginBottom: "14px", lineHeight: 1.6 }}>{form.youtube ? "لم يتم التعرّف على مُعرّف صحيح — تأكد من الرابط." : "الصق الرابط الكامل من يوتيوب — سيُستخرج المُعرّف تلقائياً. تأكد أن الفيديو «غير مُدرج» والتضمين مسموح."}</div>
          )}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "140px" }}><AInput label="المدة (دقيقة)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
            <div style={{ paddingTop: "20px" }}><AToggle on={form.free} onClick={() => setForm({ ...form, free: !form.free })} label="درس مجاني (معاينة)" /></div>
          </div>
          {modalErr && <div style={{ color: "var(--bad)", fontSize: "13px", marginTop: "10px" }}>{modalErr}</div>}
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <ABtn full onClick={() => void commit()} icon="check" disabled={saving}>حفظ الدرس</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}

      {preview && (
        <AModal title={`معاينة: ${preview.title}`} onClose={() => setPreview(null)} wide>
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
            <iframe title={`معاينة ${preview.title}`} src={`https://www.youtube-nocookie.com/embed/${ytId(preview.youtubeId)}?rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}></iframe>
          </div>
          <div style={{ color: "var(--text-dim)", fontSize: "12.5px", marginTop: "12px", lineHeight: 1.7 }}>إن لم يعمل الفيديو هنا، تأكد من أن التضمين مسموح في إعدادات الفيديو على يوتيوب.</div>
        </AModal>
      )}
    </>
  );
}
