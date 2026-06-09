// ============ الكورسات + الكاتيجوري + الدرس ============

// كتالوج الكورسات
function CoursesPage({ ctx }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const levels = ["all", ...new Set(CATEGORIES.map(c => c.level))];
  const levelLabels = { all: "الكل", "تأسيسي": "تأسيسي", "مدرسي": "مدرسي", "أزهري": "أزهري", "متدرّج": "متدرّج", "قرآني": "قرآني" };
  const list = CATEGORIES.filter(c =>
    (filter === "all" || c.level === filter) &&
    (q === "" || (c.title + c.tagline + c.desc).includes(q))
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
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث عن مسار أو مادة…" style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "15px", color: "var(--ink)" }} />
            {q && <button onClick={() => setQ("")} style={{ color: "var(--muted)" }}><Icon name="x" size={17} /></button>}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginInlineStart: "auto" }}>
            {levels.map(l => (
              <button key={l} onClick={() => setFilter(l)} style={{ padding: "9px 18px", borderRadius: "999px", fontSize: "14px", fontWeight: 700, transition: "all .2s", background: filter === l ? "var(--navy-800)" : "var(--cream-2)", color: filter === l ? "#fff" : "var(--ink-2)" }}>{levelLabels[l]}</button>
            ))}
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingTop: "56px" }}>
        <div className="wrap">
          <div style={{ color: "var(--muted)", fontSize: "14.5px", fontWeight: 600, marginBottom: "24px" }}>{list.length.toLocaleString("ar-EG")} مسار{list.length !== 1 ? "ات" : ""} تعليمي</div>
          {list.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <Icon name="search" size={48} style={{ opacity: .4, margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px" }}>لا توجد نتائج مطابقة لبحثك.</p>
            </div>
          ) : (
            <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
              {list.map((c, i) => <CategoryCard key={c.id} cat={c} ctx={ctx} idx={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// صفحة الكاتيجوري (مع الساب-كاتيجوريز والدروس)
function CategoryPage({ ctx }) {
  const cat = CATEGORIES.find(c => c.id === ctx.params.catId) || CATEGORIES[0];
  const { user, isUnlocked, nav, openCheckout } = ctx;
  const unlocked = isUnlocked(cat.id);
  // مجموعات الساب (الأزهر فيه groups)
  const groups = cat.groups ? cat.groups : [{ id: "main", title: null, subs: cat.subs }];
  const [tab, setTab] = useState(groups[0].id);
  const [openSub, setOpenSub] = useState(null);
  const [q, setQ] = useState("");
  const activeGroup = groups.find(g => g.id === tab) || groups[0];
  const subs = activeGroup.subs.filter(s => q === "" || s.title.includes(q) || (s.note || "").includes(q));

  return (
    <div>
      {/* رأس */}
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "44px 0 52px", position: "relative", overflow: "hidden" }}>
        <Ornament size={220} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-60px", insetInlineEnd: "3%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <button onClick={() => nav("courses")} style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#9fb0bf", fontSize: "14px", fontWeight: 700, marginBottom: "22px" }}><Icon name="chevL" size={16} /> كل الكورسات</button>
          <div style={{ display: "flex", gap: "22px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <span style={{ width: "78px", height: "78px", borderRadius: "20px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span className="serif" style={{ color: "var(--navy-900)", fontSize: "38px", fontWeight: 700 }}>{cat.glyph}</span>
            </span>
            <div style={{ flexGrow: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                <h1 style={{ color: "#fff", fontSize: "clamp(26px,3.4vw,38px)" }}>{cat.title}</h1>
                <Badge tone="gold">{cat.level}</Badge>
                {unlocked ? <Badge tone="green"><Icon name="unlock" size={13} /> مُفعّل</Badge> : <Badge style={{ background: "rgba(255,255,255,.12)", color: "#cdd7e0" }}><Icon name="lock" size={13} /> مغلق</Badge>}
              </div>
              <div style={{ color: "var(--gold-200)", fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{cat.tagline}</div>
              <p style={{ color: "#c5d2dd", fontSize: "16px", lineHeight: 1.8, maxWidth: "680px" }}>{cat.desc}</p>
            </div>
            {!unlocked && (
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", borderRadius: "var(--r)", padding: "20px", minWidth: "230px" }}>
                <div style={{ fontSize: "13px", color: "#9fb0bf", marginBottom: "4px" }}>افتح هذا المسار كاملاً</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "14px" }}>
                  <span style={{ fontSize: "30px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{PLANS[0].priceAED.toLocaleString("ar-EG")}</span>
                  <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-400)" }}>د.إ</span>
                  <span style={{ fontSize: "12.5px", color: "#9fb0bf" }}>· دفعة واحدة</span>
                </div>
                <Btn variant="gold" full icon="unlock" onClick={() => openCheckout("single", cat.id)}>اشترِ المسار</Btn>
                <div style={{ fontSize: "12px", color: "#9fb0bf", marginTop: "10px", textAlign: "center" }}>الدرس الأول من كل وحدة مجاني</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "44px" }}>
        <div className="wrap">
          {/* تبويبات المجموعات (للأزهر) */}
          {groups.length > 1 && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "26px", flexWrap: "wrap" }}>
              {groups.map(g => (
                <button key={g.id} onClick={() => { setTab(g.id); setOpenSub(null); }} style={{ padding: "12px 26px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, transition: "all .2s", background: tab === g.id ? "var(--navy-800)" : "var(--paper)", color: tab === g.id ? "#fff" : "var(--ink-2)", boxShadow: tab === g.id ? "var(--shadow)" : "inset 0 0 0 1px var(--line)" }}>{g.title}</button>
              ))}
            </div>
          )}

          {/* بحث داخلي */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "999px", padding: "11px 20px", maxWidth: "380px", marginBottom: "24px" }}>
            <Icon name="search" size={18} style={{ color: "var(--muted)" }} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث داخل المسار…" style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "14.5px" }} />
          </div>

          {/* أكورديون الساب-كاتيجوريز */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {subs.map((sub) => {
              const lessons = genLessons(cat.id, (activeGroup.id !== "main" ? activeGroup.id + "-" : "") + sub.id, sub.title);
              const isOpen = openSub === sub.id;
              const totalMin = lessons.reduce((a, l) => a + l.duration, 0);
              return (
                <div key={sub.id} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: isOpen ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
                  <button onClick={() => setOpenSub(isOpen ? null : sub.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", padding: "20px 24px", textAlign: "right" }}>
                    <span style={{ width: 46, height: 46, borderRadius: "13px", background: isOpen ? "var(--navy-800)" : "var(--cream-2)", color: isOpen ? "var(--gold-400)" : "var(--navy-700)", display: "grid", placeItems: "center", transition: "all .2s", flexShrink: 0 }}><Icon name="book" size={21} /></span>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--navy-900)" }}>{sub.title}</div>
                      <div style={{ fontSize: "13.5px", color: "var(--muted)", marginTop: "2px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                        {sub.note && <span style={{ color: "var(--gold-700)", fontWeight: 700 }}>{sub.note}</span>}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Icon name="play" size={12} /> {lessons.length.toLocaleString("ar-EG")} درس</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Icon name="clock" size={13} /> {totalMin.toLocaleString("ar-EG")} دقيقة</span>
                      </div>
                    </div>
                    {!unlocked && <Icon name="lock" size={17} style={{ color: "var(--muted)" }} />}
                    <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--cream-2)", color: "var(--navy-800)", display: "grid", placeItems: "center", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}><Icon name="chevD" size={16} /></span>
                  </button>
                  <div style={{ maxHeight: isOpen ? `${lessons.length * 86 + 24}px` : "0", overflow: "hidden", transition: "max-height .4s cubic-bezier(.2,.7,.2,1)" }}>
                    <div style={{ borderTop: "1px solid var(--line-2)", padding: "8px" }}>
                      {lessons.map(lesson => {
                        const canWatch = unlocked || lesson.free;
                        const done = ctx.isDone(lesson.id);
                        return (
                          <button key={lesson.id} onClick={() => canWatch ? nav("lesson", { catId: cat.id, lesson, lessons, subTitle: sub.title }) : openCheckout("single", cat.id)}
                            style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "12px", textAlign: "right", transition: "background .18s" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--cream)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            <span style={{ width: 38, height: 38, borderRadius: "10px", flexShrink: 0, display: "grid", placeItems: "center",
                              background: done ? "var(--green)" : canWatch ? "var(--gold-100)" : "var(--cream-2)",
                              color: done ? "#fff" : canWatch ? "var(--gold-700)" : "var(--muted)" }}>
                              <Icon name={done ? "check" : canWatch ? "play" : "lock"} size={done ? 18 : 16} stroke={done ? 2.6 : 1.8} />
                            </span>
                            <div style={{ flexGrow: 1 }}>
                              <div style={{ fontSize: "15px", fontWeight: 700, color: canWatch ? "var(--ink)" : "var(--muted)" }}>الدرس {lesson.idx.toLocaleString("ar-EG")}: {lesson.title}</div>
                              <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "1px" }}>{lesson.duration.toLocaleString("ar-EG")} دقيقة</div>
                            </div>
                            {lesson.free && !unlocked && <Badge tone="green">معاينة مجانية</Badge>}
                            {canWatch && <span style={{ color: "var(--navy-600)", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>مشاهدة <Icon name="chevL" size={14} /></span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

// صفحة الدرس / مشغّل الفيديو
function LessonPage({ ctx }) {
  const { params, nav, isDone, toggleDone, isUnlocked, addContinue } = ctx;
  const { catId, lesson, lessons, subTitle } = params;
  const cat = CATEGORIES.find(c => c.id === catId);
  const [playing, setPlaying] = useState(false);
  const done = isDone(lesson.id);
  const idx = lessons.findIndex(l => l.id === lesson.id);
  const next = lessons[idx + 1];
  const prev = lessons[idx - 1];
  const unlocked = isUnlocked(catId);

  useEffect(() => { addContinue({ catId, lesson, subTitle }); window.scrollTo(0, 0); }, [lesson.id]);

  return (
    <div style={{ background: "var(--cream)", minHeight: "80vh" }}>
      <div className="wrap" style={{ padding: "28px 24px 80px" }}>
        <button onClick={() => nav("category", { catId })} style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--muted)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}><Icon name="chevL" size={16} /> {cat.title}</button>
        <div className="lesson-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
          {/* المشغّل */}
          <div>
            <div style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "16/9", background: "linear-gradient(150deg,var(--navy-800),var(--navy-900))", boxShadow: "var(--shadow-lg)", display: "grid", placeItems: "center" }}>
              <Ornament size={200} color="rgba(191,145,64,.07)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-40px" }} />
              {!playing && ytThumb(lesson.youtube) && (
                <>
                  <img src={ytThumb(lesson.youtube, "hqdefault")} alt="" onError={e => e.currentTarget.style.display = "none"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(10,31,54,.55), rgba(10,31,54,.85))" }} />
                </>
              )}
              {!playing ? (
                <div style={{ textAlign: "center", position: "relative" }}>
                  <button onClick={() => setPlaying(true)} style={{ width: "84px", height: "84px", borderRadius: "50%", background: "var(--gold)", color: "var(--navy-900)", display: "grid", placeItems: "center", margin: "0 auto 18px", boxShadow: "0 8px 30px rgba(191,145,64,.5)", transition: "transform .2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                    <Icon name="play" size={34} />
                  </button>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>اضغط للتشغيل</div>
                  <div style={{ color: "#9fb0bf", fontSize: "13px", marginTop: "4px" }}>درس مصوّر · {lesson.duration.toLocaleString("ar-EG")} دقيقة</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", padding: "6px 14px", borderRadius: "999px", color: "#cdd7e0", fontSize: "12px", fontWeight: 700 }}>
                    <Icon name="shield" size={13} /> فيديو محمي
                  </div>
                </div>
              ) : (
                <iframe
                  title={`الدرس ${lesson.idx}: ${lesson.title}`}
                  src={`https://www.youtube-nocookie.com/embed/${ytId(lesson.youtube)}?rel=0&modestbranding=1&autoplay=1&playsinline=1&color=white`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                ></iframe>
              )}
            </div>

            {/* عنوان ومعلومات الدرس */}
            <div style={{ marginTop: "26px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <Badge tone="navy">{cat.title}</Badge>
                <Badge tone="gold">{subTitle}</Badge>
                {lesson.free && <Badge tone="green">معاينة مجانية</Badge>}
              </div>
              <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: "12px" }}>الدرس {lesson.idx.toLocaleString("ar-EG")}: {lesson.title}</h1>
              <div style={{ display: "flex", gap: "20px", color: "var(--muted)", fontSize: "14.5px", fontWeight: 600, marginBottom: "20px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="clock" size={16} /> {lesson.duration.toLocaleString("ar-EG")} دقيقة</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="user" size={16} /> الأستاذ محمد حجاج</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="layers" size={16} /> الدرس {lesson.idx.toLocaleString("ar-EG")} من {lessons.length.toLocaleString("ar-EG")}</span>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", padding: "20px", background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
                <Btn variant={done ? "soft" : "primary"} icon="check" onClick={() => toggleDone(lesson.id)}>{done ? "تم الإكمال ✓" : "تحديد كمكتمل"}</Btn>
                {prev && <Btn variant="ghost" icon="chevR" onClick={() => nav("lesson", { catId, lesson: prev, lessons, subTitle })}>الدرس السابق</Btn>}
                {next ? <Btn variant="outline" iconAfter="chevL" onClick={() => (unlocked || next.free) ? nav("lesson", { catId, lesson: next, lessons, subTitle }) : ctx.openCheckout("single", catId)} style={{ marginInlineStart: "auto" }}>الدرس التالي</Btn>
                  : <Badge tone="green" style={{ marginInlineStart: "auto", padding: "10px 16px" }}><Icon name="cap" size={15} /> نهاية الوحدة</Badge>}
              </div>
            </div>
          </div>

          {/* قائمة دروس الوحدة */}
          <aside style={{ position: "sticky", top: "92px", background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line-2)", background: "var(--cream)" }}>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--navy-900)" }}>دروس الوحدة</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{subTitle}</div>
            </div>
            <div style={{ maxHeight: "560px", overflowY: "auto", padding: "8px" }}>
              {lessons.map(l => {
                const can = unlocked || l.free;
                const active = l.id === lesson.id;
                const ld = isDone(l.id);
                return (
                  <button key={l.id} onClick={() => can ? nav("lesson", { catId, lesson: l, lessons, subTitle }) : ctx.openCheckout("single", catId)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "11px", textAlign: "right", background: active ? "var(--gold-100)" : "transparent", transition: "background .18s", marginBottom: "2px" }}>
                    <span style={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, display: "grid", placeItems: "center", background: ld ? "var(--green)" : active ? "var(--gold)" : can ? "var(--cream-2)" : "var(--cream-2)", color: ld ? "#fff" : active ? "#fff" : can ? "var(--navy-700)" : "var(--muted)" }}>
                      <Icon name={ld ? "check" : can ? "play" : "lock"} size={ld ? 15 : 13} stroke={ld ? 2.6 : 1.8} />
                    </span>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: active ? "var(--navy-900)" : can ? "var(--ink)" : "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.idx.toLocaleString("ar-EG")}. {l.title}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)" }}>{l.duration.toLocaleString("ar-EG")} دقيقة</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CoursesPage, CategoryPage, LessonPage });
