// ============ تبويبات الأدمن (٢): الفيديوهات + المحتوى + الطلاب ============

// ---- الفيديوهات والدروس ----
function VideosTab({ ctx }) {
  const save = useSave(ctx);
  const [catId, setCatId] = useState(CATEGORIES[0]?.id);
  const cat = CATEGORIES.find(c => c.id === catId) || CATEGORIES[0];
  const hasGroups = !!cat.groups;
  const [groupId, setGroupId] = useState(hasGroups ? cat.groups[0].id : "main");
  const group = hasGroups ? cat.groups.find(g => g.id === groupId) : { id: "main", subs: cat.subs };
  const subsList = group ? group.subs : [];
  const [subId, setSubId] = useState(subsList[0]?.id);
  const sub = subsList.find(s => s.id === subId) || subsList[0];

  const [edit, setEdit] = useState(null); // lesson or {new:true}
  const [preview, setPreview] = useState(null); // معاينة تشغيل درس
  const blank = { title: "", youtube: "", duration: 20, free: false };
  const [form, setForm] = useState(blank);

  // عند تغيير القسم
  const changeCat = (id) => {
    const c = CATEGORIES.find(x => x.id === id);
    setCatId(id);
    const g = c.groups ? c.groups[0] : { id: "main", subs: c.subs };
    setGroupId(c.groups ? c.groups[0].id : "main");
    setSubId((c.groups ? g.subs : c.subs)[0]?.id);
  };
  const changeGroup = (gid) => { setGroupId(gid); const g = cat.groups.find(x => x.id === gid); setSubId(g.subs[0]?.id); };

  const grpArg = hasGroups ? group : null;
  const lessons = sub ? lessonsOf(cat, grpArg, sub) : [];
  const key = sub ? lessonsKey(cat.id, grpArg, sub) : "";

  const commit = () => {
    if (!form.title.trim()) return;
    save(db => {
      const cur = structuredClone(db.lessons[key] || lessons);
      if (edit.new) cur.push({ id: key + "-" + Date.now(), title: form.title, sub: sub.title, duration: Number(form.duration) || 0, youtube: ytId(form.youtube), free: form.free });
      else { const l = cur.find(x => x.id === edit.id); if (l) { l.title = form.title; l.duration = Number(form.duration) || 0; l.youtube = ytId(form.youtube); l.free = form.free; } }
      cur.forEach((l, i) => l.idx = i + 1);
      db.lessons[key] = cur;
    });
    setEdit(null);
  };
  const del = (l) => { if (confirmDel(`حذف درس «${l.title}»؟`)) save(db => { const cur = structuredClone(db.lessons[key] || lessons).filter(x => x.id !== l.id); cur.forEach((x, i) => x.idx = i + 1); db.lessons[key] = cur; }); };
  const move = (l, dir) => save(db => {
    const cur = structuredClone(db.lessons[key] || lessons);
    const i = cur.findIndex(x => x.id === l.id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= cur.length) return;
    [cur[i], cur[j]] = [cur[j], cur[i]];
    cur.forEach((x, k) => x.idx = k + 1);
    db.lessons[key] = cur;
  });
  const openNew = () => { setForm({ ...blank, youtube: DEMO_YT }); setEdit({ new: true }); };
  const openEdit = (l) => { setForm({ title: l.title, youtube: l.youtube || "", duration: l.duration, free: l.free }); setEdit(l); };

  const vid = ytId(form.youtube);
  const validVid = /^[\w-]{11}$/.test(vid);

  return (
    <>
      <AdminHead title="الفيديوهات والدروس" sub="اختر القسم والمستوى لإدارة دروسه وروابط يوتيوب" action={sub && <ABtn icon="play" onClick={openNew}>إضافة درس</ABtn>} />

      {/* إرشاد سريع لسير العمل عبر يوتيوب */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", background: "rgba(191,145,64,.08)", border: "1px solid rgba(191,145,64,.25)", borderRadius: "12px", padding: "13px 16px", marginBottom: "18px", color: "#cdd7e0", fontSize: "13px", lineHeight: 1.8 }}>
        <Icon name="shield" size={17} style={{ color: "var(--gold-400)", flexShrink: 0, marginTop: "4px" }} />
        <span>ارفع الفيديو على قناتك في يوتيوب بخصوصية <b style={{ color: "var(--gold-400)" }}>«غير مُدرج»</b> مع السماح بالتضمين، ثم الصق رابطه هنا — لن يظهر في بحث يوتيوب وسيُعرض داخل المنصة فقط. استخدم زر المعاينة ▶ بجانب أي درس للتأكد أن التشغيل يعمل.</span>
      </div>

      {/* المحدّدات */}
      <ACard style={{ marginBottom: "18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: hasGroups ? "1fr 1fr 1fr" : "1fr 1fr", gap: "12px" }} className="admin-selectors">
          <ASelect label="القسم" value={catId} onChange={e => changeCat(e.target.value)} options={CATEGORIES.map(c => ({ v: c.id, l: c.title }))} />
          {hasGroups && <ASelect label="المجموعة" value={groupId} onChange={e => changeGroup(e.target.value)} options={cat.groups.map(g => ({ v: g.id, l: g.title }))} />}
          <ASelect label="المستوى" value={subId} onChange={e => setSubId(e.target.value)} options={subsList.map(s => ({ v: s.id, l: s.title }))} />
        </div>
      </ACard>

      {/* قائمة الدروس */}
      <ACard>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h3 style={{ color: "#fff", fontSize: "16px" }}>{sub ? `دروس: ${sub.title}` : "—"}</h3>
          <span style={{ color: "#7f909f", fontSize: "13px" }}>{lessons.length.toLocaleString("ar-EG")} درس</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {lessons.map((l, li) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: "13px", padding: "12px 14px", background: "#0c2235", borderRadius: "11px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0 }}>
                <button onClick={() => move(l, -1)} disabled={li === 0} title="تحريك لأعلى" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: li === 0 ? "#2a4863" : "#9fb0bf", cursor: li === 0 ? "default" : "pointer" }}><Icon name="up" size={14} /></button>
                <button onClick={() => move(l, 1)} disabled={li === lessons.length - 1} title="تحريك لأسفل" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: li === lessons.length - 1 ? "#2a4863" : "#9fb0bf", cursor: li === lessons.length - 1 ? "default" : "pointer" }}><Icon name="down" size={14} /></button>
              </div>
              <span style={{ width: 30, height: 30, borderRadius: "9px", background: "#143655", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 800, fontSize: "13px" }}>{l.idx.toLocaleString("ar-EG")}</span>
              {ytThumb(l.youtube) && <img src={ytThumb(l.youtube)} alt="" loading="lazy" onError={e => e.currentTarget.style.display = "none"} style={{ width: 66, height: 40, borderRadius: "8px", objectFit: "cover", flexShrink: 0, background: "#143655" }} className="vid-thumb" />}
              <div style={{ flexGrow: 1, minWidth: 0 }}>
                <div style={{ color: "#fff", fontSize: "14.5px", fontWeight: 700 }}>{l.title}</div>
                <div style={{ display: "flex", gap: "12px", marginTop: "2px", flexWrap: "wrap" }}>
                  <span style={{ color: "#7f909f", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px" }}><Icon name="clock" size={12} /> {l.duration.toLocaleString("ar-EG")} د</span>
                  <span style={{ color: "#6fa8d0", fontSize: "11.5px", fontFamily: "ui-monospace,monospace", direction: "ltr" }}>{l.youtube ? ytId(l.youtube) : "—"}</span>
                </div>
              </div>
              {l.free && <span style={{ fontSize: "11px", fontWeight: 700, color: "#7fd1a8", background: "rgba(63,125,94,.18)", padding: "3px 9px", borderRadius: "999px", flexShrink: 0 }}>مجاني</span>}
              <button onClick={() => setPreview(l)} title="معاينة التشغيل" style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(191,145,64,.14)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="play" size={15} /></button>
              <button onClick={() => openEdit(l)} title="تعديل" style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "#cdd7e0", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="book" size={16} /></button>
              <button onClick={() => del(l)} title="حذف" style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "#e88a76", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="x" size={16} /></button>
            </div>
          ))}
          {lessons.length === 0 && <div style={{ color: "#7f909f", textAlign: "center", padding: "30px", fontSize: "14px" }}>لا توجد دروس بعد — أضف أول درس.</div>}
        </div>
      </ACard>

      {edit && (
        <AModal title={edit.new ? "إضافة درس" : "تعديل الدرس"} onClose={() => setEdit(null)}>
          <AInput label="عنوان الدرس" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="مثال: مدخل وتمهيد" />
          <AInput label="رابط يوتيوب أو المُعرّف" value={form.youtube} onChange={e => setForm({ ...form, youtube: e.target.value })} placeholder="https://youtu.be/XXXXXXXXXXX" mono />
          {validVid ? (
            <div style={{ display: "flex", gap: "12px", alignItems: "center", background: "#0c2235", borderRadius: "11px", padding: "10px", marginTop: "-8px", marginBottom: "14px" }}>
              <img src={ytThumb(vid)} alt="" onError={e => e.currentTarget.style.display = "none"} style={{ width: 96, height: 54, borderRadius: "8px", objectFit: "cover", background: "#143655", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "#7fd1a8", fontSize: "12.5px", fontWeight: 700, display: "flex", gap: "6px", alignItems: "center" }}><Icon name="check" size={14} stroke={2.4} /> تم التعرّف على الفيديو</div>
                <div style={{ color: "#6fa8d0", fontSize: "11.5px", fontFamily: "ui-monospace,monospace", direction: "ltr", textAlign: "right" }}>{vid}</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "11.5px", color: form.youtube ? "#e88a76" : "#7f909f", marginTop: "-8px", marginBottom: "14px", lineHeight: 1.6 }}>{form.youtube ? "لم يتم التعرّف على مُعرّف صحيح — تأكد من الرابط." : "الصق الرابط الكامل من يوتيوب — سيُستخرج المُعرّف تلقائياً. تأكد أن الفيديو «غير مُدرج» والتضمين مسموح."}</div>
          )}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ width: "140px" }}><AInput label="المدة (دقيقة)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <div style={{ paddingTop: "20px" }}><AToggle on={form.free} onClick={() => setForm({ ...form, free: !form.free })} label="درس مجاني (معاينة)" /></div>
          </div>
          <div style={{ display: "flex", gap: "10px", marginTop: "14px" }}>
            <ABtn full onClick={commit} icon="check">حفظ الدرس</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}

      {preview && (
        <AModal title={`معاينة: ${preview.title}`} onClose={() => setPreview(null)} wide>
          <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
            <iframe title={`معاينة ${preview.title}`} src={`https://www.youtube-nocookie.com/embed/${ytId(preview.youtube)}?rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}></iframe>
          </div>
          <div style={{ color: "#7f909f", fontSize: "12.5px", marginTop: "12px", lineHeight: 1.7 }}>إن لم يعمل الفيديو هنا، تأكد من أن التضمين مسموح في إعدادات الفيديو على يوتيوب.</div>
        </AModal>
      )}
    </>
  );
}

// ---- المحتوى العام ----
function ContentTab({ ctx }) {
  const save = useSave(ctx);
  const db = Store.get();
  const [hero, setHero] = useState(db.hero);
  const [ins, setIns] = useState(db.instructor);
  const [plans, setPlans] = useState(db.plans);

  const saveHero = () => save(d => { d.hero = hero; });
  const saveIns = () => save(d => { d.instructor = ins; });
  const savePlans = () => save(d => { d.plans = plans; });

  const setStat = (i, k, v) => setIns({ ...ins, stats: ins.stats.map((s, j) => j === i ? { ...s, [k]: k === "value" ? Number(v) || 0 : v } : s) });
  const setBio = (i, v) => setIns({ ...ins, bio: ins.bio.map((b, j) => j === i ? v : b) });
  const setCred = (i, v) => setIns({ ...ins, credentials: ins.credentials.map((c, j) => j === i ? v : c) });
  const setPlan = (i, k, v) => setPlans(plans.map((p, j) => j === i ? { ...p, [k]: (k.startsWith("price") ? Number(v) || 0 : v) } : p));

  return (
    <>
      <AdminHead title="المحتوى العام" sub="تعديل النصوص والإحصاءات والأسعار الظاهرة في الموقع" />

      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>قسم البطل (Hero)</h3>
        <AArea label="العنوان الرئيسي" value={hero.title} onChange={e => setHero({ ...hero, title: e.target.value })} rows={2} />
        <AArea label="النص التعريفي" value={hero.sub} onChange={e => setHero({ ...hero, sub: e.target.value })} rows={3} />
        <ABtn icon="check" onClick={saveHero}>حفظ قسم البطل</ABtn>
      </ACard>

      <ACard style={{ marginBottom: "16px" }}>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>بيانات الأستاذ</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="admin-2col">
          <AInput label="الاسم" value={ins.name} onChange={e => setIns({ ...ins, name: e.target.value })} />
          <AInput label="الصفة" value={ins.title} onChange={e => setIns({ ...ins, title: e.target.value })} />
        </div>
        <AArea label="نبذة مختصرة" value={ins.short} onChange={e => setIns({ ...ins, short: e.target.value })} rows={2} />
        <div style={{ color: "#cdd7e0", fontSize: "13px", fontWeight: 700, margin: "8px 0 8px" }}>السيرة (فقرات)</div>
        {ins.bio.map((b, i) => <AArea key={i} value={b} onChange={e => setBio(i, e.target.value)} rows={2} />)}
        <div style={{ color: "#cdd7e0", fontSize: "13px", fontWeight: 700, margin: "8px 0 8px" }}>المؤهّلات</div>
        {ins.credentials.map((c, i) => <AInput key={i} value={c} onChange={e => setCred(i, e.target.value)} />)}
        <div style={{ color: "#cdd7e0", fontSize: "13px", fontWeight: 700, margin: "8px 0 10px" }}>الإحصاءات المعروضة</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }} className="admin-2col">
          {ins.stats.map((s, i) => (
            <div key={i} style={{ background: "#0c2235", borderRadius: "11px", padding: "12px", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ width: "80px" }}><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>القيمة</span><input value={s.value} onChange={e => setStat(i, "value", e.target.value)} type="number" style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "8px", color: "#fff", outline: "none" }} /></div>
              <div style={{ width: "56px" }}><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>لاحقة</span><input value={s.suffix} onChange={e => setStat(i, "suffix", e.target.value)} style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "8px", color: "#fff", outline: "none", direction: "ltr" }} /></div>
              <div style={{ flexGrow: 1 }}><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>الوصف</span><input value={s.label} onChange={e => setStat(i, "label", e.target.value)} style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "8px", color: "#fff", outline: "none" }} /></div>
            </div>
          ))}
        </div>
        <ABtn icon="check" onClick={saveIns}>حفظ بيانات الأستاذ</ABtn>
      </ACard>

      <ACard>
        <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "16px" }}>الباقات والأسعار</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
          {plans.map((p, i) => (
            <div key={p.id} style={{ background: "#0c2235", borderRadius: "12px", padding: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "10px", marginBottom: "8px" }} className="admin-2col">
                <div><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>اسم الباقة</span><input value={p.name} onChange={e => setPlan(i, "name", e.target.value)} style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "9px", color: "#fff", outline: "none" }} /></div>
                <div><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>المدة</span><input value={p.period} onChange={e => setPlan(i, "period", e.target.value)} style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "9px", color: "#fff", outline: "none" }} /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[["priceAED", "درهم"], ["priceEGP", "جنيه"], ["priceUSD", "دولار"]].map(([k, lbl]) => (
                  <div key={k}><span style={{ display: "block", fontSize: "11px", color: "#7f909f", marginBottom: "5px" }}>{lbl}</span><input type="number" value={p[k]} onChange={e => setPlan(i, k, e.target.value)} style={{ width: "100%", background: "#0e2944", border: "1.5px solid #1d3954", borderRadius: "8px", padding: "9px", color: "#fff", outline: "none", direction: "ltr", textAlign: "right" }} /></div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <ABtn icon="check" onClick={savePlans}>حفظ الأسعار</ABtn>
      </ACard>
    </>
  );
}

// ---- التقييمات ----
function TestimonialsTab({ ctx }) {
  const save = useSave(ctx);
  const db = Store.get();
  const list = db.testimonials || [];
  const [edit, setEdit] = useState(null); // {new:true} أو {i}
  const blank = { name: "", role: "", text: "" };
  const [form, setForm] = useState(blank);
  const openNew = () => { setForm(blank); setEdit({ new: true }); };
  const openEdit = (t, i) => { setForm({ name: t.name, role: t.role, text: t.text }); setEdit({ i }); };
  const commit = () => {
    if (!form.name.trim() || !form.text.trim()) return;
    save(d => {
      if (!d.testimonials) d.testimonials = [];
      if (edit.new) d.testimonials.unshift({ ...form });
      else Object.assign(d.testimonials[edit.i], form);
    });
    setEdit(null);
  };
  const del = (i) => { if (confirmDel("حذف هذا التقييم؟")) save(d => { d.testimonials.splice(i, 1); }); };
  const move = (i, dir) => save(d => {
    const j = i + dir;
    if (j < 0 || j >= d.testimonials.length) return;
    [d.testimonials[i], d.testimonials[j]] = [d.testimonials[j], d.testimonials[i]];
  });
  return (
    <>
      <AdminHead title="التقييمات" sub="أول ٣ تقييمات تظهر في الصفحة الرئيسية — رتّبها بالأسهم" action={<ABtn icon="star" onClick={openNew}>إضافة تقييم</ABtn>} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {list.map((t, i) => (
          <ACard key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px 18px", ...(i < 3 ? { borderColor: "rgba(191,145,64,.35)" } : {}) }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", flexShrink: 0, marginTop: "2px" }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} title="تحريك لأعلى" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === 0 ? "#2a4863" : "#9fb0bf", cursor: i === 0 ? "default" : "pointer" }}><Icon name="up" size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} title="تحريك لأسفل" style={{ width: 24, height: 18, display: "grid", placeItems: "center", color: i === list.length - 1 ? "#2a4863" : "#9fb0bf", cursor: i === list.length - 1 ? "default" : "pointer" }}><Icon name="down" size={14} /></button>
            </div>
            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>{t.name}</span>
                <span style={{ color: "#7f909f", fontSize: "12.5px" }}>{t.role}</span>
                {i < 3 && <span style={{ fontSize: "10.5px", fontWeight: 700, color: "var(--gold-400)", background: "rgba(191,145,64,.14)", padding: "2px 9px", borderRadius: "999px" }}>تظهر في الرئيسية</span>}
              </div>
              <p style={{ color: "#cdd7e0", fontSize: "13.5px", lineHeight: 1.8 }}>«{t.text}»</p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button onClick={() => openEdit(t, i)} title="تعديل" style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "#cdd7e0", display: "grid", placeItems: "center" }}><Icon name="book" size={16} /></button>
              <button onClick={() => del(i)} title="حذف" style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "#e88a76", display: "grid", placeItems: "center" }}><Icon name="x" size={16} /></button>
            </div>
          </ACard>
        ))}
        {list.length === 0 && <div style={{ color: "#7f909f", textAlign: "center", padding: "40px", fontSize: "14px" }}>لا توجد تقييمات بعد — أضف أول تقييم.</div>}
      </div>
      {edit && (
        <AModal title={edit.new ? "إضافة تقييم" : "تعديل التقييم"} onClose={() => setEdit(null)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <AInput label="الاسم" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثال: أم عبدالله" autoFocus />
            <AInput label="الصفة" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="مثال: ولية أمر — أبوظبي" />
          </div>
          <AArea label="نص التقييم" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={4} />
          <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
            <ABtn full onClick={commit} icon="check">حفظ</ABtn>
            <ABtn full tone="ghost" onClick={() => setEdit(null)}>إلغاء</ABtn>
          </div>
        </AModal>
      )}
    </>
  );
}

// ---- الطلاب ----
function StudentsTab({ ctx }) {
  const save = useSave(ctx);
  const db = Store.get();
  const [add, setAdd] = useState(false);
  const [q, setQ] = useState("");
  const [f, setF] = useState({ name: "", email: "", plan: "الاشتراك الشهري" });
  const list = db.students.filter(s => !q || s.name.includes(q) || s.email.includes(q));
  const del = (s) => { if (confirmDel(`حذف الطالب «${s.name}»؟`)) save(db => { db.students = db.students.filter(x => x.id !== s.id); }); };
  const toggle = (s) => save(db => { const st = db.students.find(x => x.id === s.id); st.status = st.status === "نشط" ? "متوقف" : "نشط"; });
  const commit = () => { if (!f.name.trim()) return; save(db => db.students.unshift({ id: "s" + Date.now(), name: f.name, email: f.email, plan: f.plan, joined: "٢٠٢٦/٠٦/٠٦", status: "نشط" })); setAdd(false); setF({ name: "", email: "", plan: "الاشتراك الشهري" }); };
  return (
    <>
      <AdminHead title="الطلاب" sub={`${db.students.length.toLocaleString("ar-EG")} طالب مسجّل`} action={
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث بالاسم أو البريد…" style={{ width: "200px", background: "#0c2235", border: "1.5px solid #1d3954", borderRadius: "10px", padding: "10px 14px", fontSize: "13.5px", color: "#fff", outline: "none" }} onFocus={e => e.target.style.borderColor = "var(--gold)"} onBlur={e => e.target.style.borderColor = "#1d3954"} />
          <ABtn icon="user" onClick={() => setAdd(true)}>إضافة طالب</ABtn>
        </div>
      } />
      <ACard style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1.2fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid #1d3954", fontSize: "12.5px", fontWeight: 700, color: "#7f909f" }} className="stu-head">
          <span>الاسم</span><span>البريد</span><span>الباقة</span><span>الحالة</span><span></span>
        </div>
        {list.map(s => (
          <div key={s.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1.2fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid #122c44", alignItems: "center" }} className="stu-row">
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{s.name}</div>
              <div style={{ color: "#7f909f", fontSize: "11.5px" }}>انضم {s.joined}</div>
            </div>
            <span style={{ color: "#9fb0bf", fontSize: "13px", direction: "ltr", textAlign: "right" }}>{s.email}</span>
            <span style={{ color: "#cdd7e0", fontSize: "13px" }}>{s.plan}</span>
            <button onClick={() => toggle(s)} style={{ justifySelf: "start", fontSize: "11.5px", fontWeight: 700, color: s.status === "نشط" ? "#7fd1a8" : "#e88a76", background: s.status === "نشط" ? "rgba(63,125,94,.18)" : "rgba(180,69,47,.16)", padding: "4px 12px", borderRadius: "999px" }}>{s.status}</button>
            <button onClick={() => del(s)} style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "#e88a76", display: "grid", placeItems: "center" }}><Icon name="x" size={16} /></button>
          </div>
        ))}
        {list.length === 0 && <div style={{ color: "#7f909f", textAlign: "center", padding: "36px", fontSize: "14px" }}>لا توجد نتائج مطابقة.</div>}
      </ACard>
      {add && (
        <AModal title="إضافة طالب" onClose={() => setAdd(false)}>
          <AInput label="الاسم" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
          <AInput label="البريد الإلكتروني" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} mono />
          <ASelect label="الباقة" value={f.plan} onChange={e => setF({ ...f, plan: e.target.value })} options={["الاشتراك الشهري", "دورة واحدة", "حزمة كاملة"].map(v => ({ v, l: v }))} />
          <ABtn full icon="check" onClick={commit}>إضافة</ABtn>
        </AModal>
      )}
    </>
  );
}

// ---- المدفوعات ----
function PaymentsTab({ ctx }) {
  const save = useSave(ctx);
  const db = Store.get();
  const del = (p) => { if (confirmDel("حذف هذه العملية؟")) save(db => { db.payments = db.payments.filter(x => x.id !== p.id); }); };
  const total = db.payments.filter(p => p.status === "ناجح").length;
  return (
    <>
      <AdminHead title="المدفوعات" sub={`${total.toLocaleString("ar-EG")} عملية ناجحة من ${db.payments.length.toLocaleString("ar-EG")}`} />
      <ACard style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid #1d3954", fontSize: "12.5px", fontWeight: 700, color: "#7f909f" }} className="stu-head">
          <span>الطالب</span><span>الباقة</span><span>المبلغ</span><span>التاريخ</span><span>الحالة</span><span></span>
        </div>
        {db.payments.map(p => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1.2fr 1fr 1fr 1fr auto", gap: "10px", padding: "14px 20px", borderBottom: "1px solid #122c44", alignItems: "center" }} className="stu-row">
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{p.student}</span>
            <span style={{ color: "#cdd7e0", fontSize: "13px" }}>{p.plan}</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}>{p.amount.toLocaleString("ar-EG")} {p.cur}</span>
            <span style={{ color: "#9fb0bf", fontSize: "13px" }}>{p.date}</span>
            <span style={{ justifySelf: "start", fontSize: "11.5px", fontWeight: 700, color: p.status === "ناجح" ? "#7fd1a8" : "#e88a76", background: p.status === "ناجح" ? "rgba(63,125,94,.18)" : "rgba(180,69,47,.16)", padding: "4px 12px", borderRadius: "999px" }}>{p.status}</span>
            <button onClick={() => del(p)} style={{ width: 34, height: 34, borderRadius: "9px", background: "rgba(180,69,47,.16)", color: "#e88a76", display: "grid", placeItems: "center" }}><Icon name="x" size={16} /></button>
          </div>
        ))}
      </ACard>
    </>
  );
}

// ---- لوحة الأدمن الرئيسية ----
function AdminDashboard({ ctx }) {
  const [tab, setTabRaw] = useState(() => { try { return localStorage.getItem("mh_admin_tab") || "overview"; } catch { return "overview"; } });
  const setTab = (t) => { setTabRaw(t); try { localStorage.setItem("mh_admin_tab", t); } catch {} };
  let C;
  switch (tab) {
    case "overview": C = <OverviewTab ctx={ctx} setTab={setTab} />; break;
    case "cats": C = <CategoriesTab ctx={ctx} />; break;
    case "videos": C = <VideosTab ctx={ctx} />; break;
    case "content": C = <ContentTab ctx={ctx} />; break;
    case "testi": C = <TestimonialsTab ctx={ctx} />; break;
    case "students": C = <StudentsTab ctx={ctx} />; break;
    case "payments": C = <PaymentsTab ctx={ctx} />; break;
    default: C = <OverviewTab ctx={ctx} setTab={setTab} />;
  }
  return <AdminShell ctx={ctx} active={tab} setTab={setTab}>{C}</AdminShell>;
}

Object.assign(window, { VideosTab, ContentTab, TestimonialsTab, StudentsTab, PaymentsTab, AdminDashboard });
