// ============ تبويبات لوحة الأدمن (CRUD) ============

// أداة حفظ: استنساخ DB، تعديل، حفظ، إعادة رسم
function useSave(ctx) {
  return (mut) => { const db = structuredClone(Store.get()); mut(db); Store.set(db); ctx.bumpDB(); };
}
const LEVELS = ["تأسيسي", "مدرسي", "أزهري", "متدرّج", "قرآني"];

function countVideos() {
  let n = 0;
  CATEGORIES.forEach(c => {
    const groups = c.groups ? c.groups : [{ id: "main", subs: c.subs }];
    groups.forEach(g => (g.subs || []).forEach(s => { n += lessonsOf(c, g.id === "main" ? null : g, s).length; }));
  });
  return n;
}

// ---- نظرة عامة ----
function OverviewTab({ ctx, setTab }) {
  const db = Store.get();
  const sums = {};
  db.payments.filter(p => p.status === "ناجح").forEach(p => { sums[p.cur] = (sums[p.cur] || 0) + p.amount; });
  const kpis = [
    { ic: "user", v: db.students.length, l: "إجمالي الطلاب", c: "var(--gold-400)" },
    { ic: "layers", v: CATEGORIES.length, l: "الأقسام الرئيسية", c: "#6fb0e0" },
    { ic: "play", v: countVideos(), l: "إجمالي الدروس", c: "#7fd1a8" },
    { ic: "card", v: db.payments.length, l: "عمليات الدفع", c: "#d9a3e0" },
  ];
  return (
    <>
      <AdminHead title="نظرة عامة" sub="ملخّص أداء المنصة وأحدث النشاطات" action={<ABtn icon="play" onClick={() => setTab("videos")}>إضافة درس</ABtn>} />
      <div className="admin-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "26px" }}>
        {kpis.map((k, i) => (
          <ACard key={i} style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ width: 52, height: 52, borderRadius: "14px", background: "#0c2235", color: k.c, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={k.ic} size={25} /></span>
            <div>
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: 900, lineHeight: 1 }}>{k.v.toLocaleString("ar-EG")}</div>
              <div style={{ color: "#7f909f", fontSize: "13px", marginTop: "4px" }}>{k.l}</div>
            </div>
          </ACard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px" }} className="admin-2col">
        <ACard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff", fontSize: "17px" }}>أحدث المدفوعات</h3>
            <button onClick={() => setTab("payments")} style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>عرض الكل</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {db.payments.slice(0, 4).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", padding: "11px 14px", background: "#0c2235", borderRadius: "11px" }}>
                <div>
                  <div style={{ color: "#fff", fontSize: "14px", fontWeight: 700 }}>{p.student}</div>
                  <div style={{ color: "#7f909f", fontSize: "12px" }}>{p.plan} · {p.date}</div>
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{p.amount.toLocaleString("ar-EG")} {p.cur}</div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: p.status === "ناجح" ? "#7fd1a8" : "#e88a76" }}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #1d3954", flexWrap: "wrap" }}>
            <span style={{ color: "#7f909f", fontSize: "12.5px", fontWeight: 700 }}>إجمالي الإيرادات الناجحة</span>
            <span style={{ color: "#7fd1a8", fontWeight: 800, fontSize: "14px" }}>{Object.entries(sums).map(([c, v]) => `${v.toLocaleString("ar-EG")} ${c}`).join(" · ") || "—"}</span>
          </div>
        </ACard>
        <ACard>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ color: "#fff", fontSize: "17px" }}>الإحصاءات المعروضة</h3>
            <button onClick={() => setTab("content")} style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>تعديل</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {INSTRUCTOR.stats.map((s, i) => (
              <div key={i} style={{ padding: "12px", background: "#0c2235", borderRadius: "11px", textAlign: "center" }}>
                <div style={{ color: "var(--gold-400)", fontWeight: 900, fontSize: "20px" }}>{s.value.toLocaleString("ar-EG")}{s.suffix}</div>
                <div style={{ color: "#7f909f", fontSize: "11.5px", marginTop: "3px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </ACard>
      </div>
    </>
  );
}

// ---- الأقسام والمستويات ----
function CategoriesTab({ ctx }) {
  const save = useSave(ctx);
  const [edit, setEdit] = useState(null); // category being edited (or {new:true})
  const [subsFor, setSubsFor] = useState(null); // catId to manage subs
  const cats = CATEGORIES;
  const blank = { title: "", tagline: "", desc: "", glyph: "✦", level: "مدرسي" };
  const [form, setForm] = useState(blank);

  const openNew = () => { setForm(blank); setEdit({ new: true }); };
  const openEdit = (c) => { setForm({ title: c.title, tagline: c.tagline, desc: c.desc, glyph: c.glyph, level: c.level }); setEdit(c); };
  const commit = () => {
    if (!form.title.trim()) return;
    save(db => {
      if (edit.new) db.cats.push({ id: "c" + Date.now(), ...form, subs: [] });
      else { const c = db.cats.find(x => x.id === edit.id); Object.assign(c, form); }
    });
    setEdit(null);
  };
  const del = (c) => { if (confirmDel(`حذف قسم «${c.title}» وكل مستوياته؟`)) save(db => { db.cats = db.cats.filter(x => x.id !== c.id); }); };

  return (
    <>
      <AdminHead title="الأقسام والمستويات" sub={`${cats.length.toLocaleString("ar-EG")} قسم رئيسي`} action={<ABtn icon="layers" onClick={openNew}>إضافة قسم</ABtn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {cats.map(c => {
          const subCount = c.groups ? c.groups.reduce((a, g) => a + g.subs.length, 0) : c.subs.length;
          return (
            <ACard key={c.id} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: 54, height: 54, borderRadius: "15px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><span className="serif" style={{ fontSize: "26px" }}>{c.glyph}</span></span>
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>{c.title}</span>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--gold-400)", background: "rgba(191,145,64,.14)", padding: "3px 10px", borderRadius: "999px" }}>{c.level}</span>
                </div>
                <div style={{ color: "#7f909f", fontSize: "13px", marginTop: "3px" }}>{c.tagline} · {subCount.toLocaleString("ar-EG")} مستوى</div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <ABtn size="sm" tone="ghost" icon="layers" onClick={() => setSubsFor(c.id)}>المستويات</ABtn>
                <ABtn size="sm" tone="outline" icon="book" onClick={() => openEdit(c)}>تعديل</ABtn>
                <button onClick={() => del(c)} style={{ width: 36, height: 36, borderRadius: "10px", background: "rgba(180,69,47,.16)", color: "#e88a76", display: "grid", placeItems: "center" }}><Icon name="x" size={17} /></button>
              </div>
            </ACard>
          );
        })}
      </div>

      {edit && (
        <AModal title={edit.new ? "إضافة قسم جديد" : "تعديل القسم"} onClose={() => setEdit(null)}>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flexShrink: 0, width: "84px" }}>
              <AInput label="الرمز" value={form.glyph} onChange={e => setForm({ ...form, glyph: e.target.value })} />
            </div>
            <div style={{ flexGrow: 1 }}><AInput label="اسم القسم" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: تأسيس القراءة" /></div>
          </div>
          <AInput label="العنوان الفرعي" value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} placeholder="وصف قصير مميّز" />
          <AArea label="الوصف" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} />
          <ASelect label="المستوى" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} options={LEVELS.map(l => ({ v: l, l }))} />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <ABtn full onClick={commit} icon="check">حفظ</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}

      {subsFor && <SubsModal ctx={ctx} catId={subsFor} onClose={() => setSubsFor(null)} />}
    </>
  );
}

// إدارة المستويات (الساب-كاتيجوريز) داخل قسم
function SubsModal({ ctx, catId, onClose }) {
  const save = useSave(ctx);
  const cat = CATEGORIES.find(c => c.id === catId);
  const groups = cat.groups ? cat.groups : [{ id: "main", title: null, subs: cat.subs }];
  const [adding, setAdding] = useState(null); // groupId
  const [val, setVal] = useState({ title: "", note: "" });

  const addSub = (gid) => {
    if (!val.title.trim()) return;
    save(db => {
      const c = db.cats.find(x => x.id === catId);
      const newSub = { id: "sub" + Date.now(), title: val.title, note: val.note };
      if (c.groups) { const g = c.groups.find(x => x.id === gid); g.subs.push(newSub); }
      else c.subs.push(newSub);
    });
    setVal({ title: "", note: "" }); setAdding(null);
  };
  const delSub = (gid, sid) => save(db => {
    const c = db.cats.find(x => x.id === catId);
    if (c.groups) { const g = c.groups.find(x => x.id === gid); g.subs = g.subs.filter(s => s.id !== sid); }
    else c.subs = c.subs.filter(s => s.id !== sid);
  });
  const renSub = (gid, sid, title) => save(db => {
    const c = db.cats.find(x => x.id === catId);
    const arr = c.groups ? c.groups.find(x => x.id === gid).subs : c.subs;
    const s = arr.find(s => s.id === sid); s.title = title;
  });

  return (
    <AModal title={`مستويات: ${cat.title}`} onClose={onClose} wide>
      {groups.map(g => (
        <div key={g.id} style={{ marginBottom: "18px" }}>
          {g.title && <div style={{ color: "var(--gold-400)", fontWeight: 800, fontSize: "15px", marginBottom: "10px" }}>{g.title}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {g.subs.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 12px", background: "#0c2235", borderRadius: "10px" }}>
                <Icon name="book" size={16} style={{ color: "#7f909f", flexShrink: 0 }} />
                <input defaultValue={s.title} onBlur={e => e.target.value !== s.title && renSub(g.id, s.id, e.target.value)} style={{ flexGrow: 1, background: "transparent", border: "none", color: "#fff", fontSize: "14px", outline: "none", fontWeight: 600 }} />
                {s.note && <span style={{ color: "#7f909f", fontSize: "11.5px", flexShrink: 0 }}>{s.note}</span>}
                <button onClick={() => delSub(g.id, s.id)} style={{ color: "#e88a76", flexShrink: 0 }}><Icon name="x" size={15} /></button>
              </div>
            ))}
          </div>
          {adding === g.id ? (
            <div style={{ display: "flex", gap: "8px", marginTop: "9px", alignItems: "flex-start" }}>
              <div style={{ flexGrow: 1 }}>
                <input autoFocus value={val.title} onChange={e => setVal({ ...val, title: e.target.value })} placeholder="اسم المستوى" style={{ width: "100%", background: "#0c2235", border: "1.5px solid var(--gold)", borderRadius: "9px", padding: "9px 12px", color: "#fff", fontSize: "13.5px", outline: "none", marginBottom: "6px" }} />
                <input value={val.note} onChange={e => setVal({ ...val, note: e.target.value })} placeholder="ملاحظة (اختياري)" style={{ width: "100%", background: "#0c2235", border: "1.5px solid #1d3954", borderRadius: "9px", padding: "8px 12px", color: "#fff", fontSize: "12.5px", outline: "none" }} />
              </div>
              <ABtn size="sm" icon="check" onClick={() => addSub(g.id)}>إضافة</ABtn>
            </div>
          ) : (
            <button onClick={() => { setAdding(g.id); setVal({ title: "", note: "" }); }} style={{ marginTop: "9px", color: "var(--gold-400)", fontSize: "13px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>＋ إضافة مستوى{g.title ? ` إلى ${g.title}` : ""}</button>
          )}
        </div>
      ))}
    </AModal>
  );
}

Object.assign(window, { OverviewTab, CategoriesTab, SubsModal, useSave, LEVELS, countVideos });
