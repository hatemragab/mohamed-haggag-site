// ============ الصفحة الرئيسية ============
function Hero({ ctx }) {
  const { nav } = ctx;
  const hero = (window.Store && Store.get().hero) || { title: "", sub: "" };
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "linear-gradient(160deg,#fdfaf4 0%,#f5eede 100%)" }}>
      {/* زخارف خلفية */}
      <div style={{ position: "absolute", inset: 0, opacity: .5, backgroundImage: "radial-gradient(circle at 85% 15%, var(--gold-100), transparent 40%)", pointerEvents: "none" }} />
      <Ornament size={180} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-50px" }} />
      <Ornament size={120} color="rgba(14,41,68,.06)" style={{ position: "absolute", bottom: "40px", insetInlineEnd: "8%" }} />

      <div className="wrap hero-grid" style={{ display: "grid", gridTemplateColumns: "1.05fr .95fr", gap: "48px", alignItems: "center", padding: "64px 24px 80px", position: "relative" }}>
        {/* النص */}
        <div className="reveal" style={{ maxWidth: "600px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,.7)", border: "1px solid var(--line)", padding: "8px 16px", borderRadius: "999px", marginBottom: "26px", boxShadow: "var(--shadow-sm)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 0 4px rgba(63,125,94,.15)" }} />
            <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--navy-800)" }}>تعليم أزهري موثوق</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px,4.6vw,52px)", lineHeight: 1.22, marginBottom: "22px" }}>
            {hero.title || <>تعلّم <span style={{ color: "var(--gold-700)" }}>العربية والقرآن</span> مع معلّمٍ أزهري بخبرة منظّمة</>}
          </h1>
          <p style={{ fontSize: "19px", color: "var(--ink-2)", lineHeight: 1.85, marginBottom: "32px", maxWidth: "540px" }}>
            {hero.sub || "تأسيس، ومناهج إماراتية ومصرية وأزهرية، وعربية لغير الناطقين بها، وتعليم القرآن الكريم — نبني المهارة لبنةً لبنة."}
          </p>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => nav("register")}>أنشئ حسابك الآن</Btn>
            <Btn variant="outline" size="lg" icon="grid" onClick={() => nav("courses")}>استعرض الكورسات</Btn>
          </div>
        </div>

        {/* الصورة */}
        <div className="reveal hero-photo" style={{ position: "relative", animationDelay: "120ms" }}>
          <div style={{ position: "absolute", inset: "18px -10px -18px 18px", borderRadius: "var(--r-xl)", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", transform: "rotate(-2.5deg)" }} />
          <div style={{ position: "relative", borderRadius: "var(--r-xl)", overflow: "hidden", boxShadow: "var(--shadow-lg)", border: "5px solid #fff", aspectRatio: "696/980", background: "var(--navy-800)" }}>
            <img src="assets/instructor.png" alt="الأستاذ محمد حجاج" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
            <div style={{ position: "absolute", insetInlineStart: 0, insetInlineEnd: 0, bottom: 0, height: "42%", background: "linear-gradient(to top, rgba(10,31,54,.78), transparent)" }} />
            <div style={{ position: "absolute", bottom: "22px", insetInlineStart: "22px", insetInlineEnd: "22px", color: "#fff" }}>
              <div style={{ fontSize: "22px", fontWeight: 800 }}>الأستاذ محمد حجاج</div>
              <div style={{ fontSize: "14px", color: "var(--gold-200)", fontWeight: 600 }}>خريج كلية الشريعة الإسلامية — الأزهر الشريف</div>
            </div>
          </div>
          {/* بطاقة عائمة */}
          <div style={{ position: "absolute", top: "30px", insetInlineEnd: "-22px", background: "#fff", borderRadius: "var(--r)", padding: "14px 18px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: "12px", animation: "fadeUp .8s .5s both" }} className="float-card">
            <span style={{ width: 44, height: 44, borderRadius: "12px", background: "#e4efe9", color: "var(--green)", display: "grid", placeItems: "center" }}><Icon name="shield" size={22} /></span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--navy-900)" }}>محتوى موثوق</div>
              <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>مضبوط علمياً وآمن لأبنائك</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsStrip() {
  return (
    <section style={{ background: "var(--navy-900)", position: "relative", overflow: "hidden" }}>
      <Ornament size={200} color="rgba(191,145,64,.07)" style={{ position: "absolute", top: "-60px", insetInlineEnd: "10%" }} />
      <div className="wrap" style={{ padding: "52px 24px" }}>
        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "24px" }}>
          {INSTRUCTOR.stats.map((s, i) => (
            <div key={i} style={{ textAlign: "center", borderInlineEnd: i < INSTRUCTOR.stats.length - 1 ? "1px solid rgba(255,255,255,.1)" : "none" }} className="stat-cell">
              <div style={{ fontSize: "clamp(28px,3vw,38px)", fontWeight: 900, color: "var(--gold-400)", lineHeight: 1 }}><Counter value={s.value} suffix={s.suffix} /></div>
              <div style={{ fontSize: "13.5px", color: "#9fb0bf", fontWeight: 600, marginTop: "10px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">لماذا هذا الأستاذ؟</span>
          <h2>تعليمٌ يبني الأساس، ويصنع الفرق</h2>
        </div>
        <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "22px" }}>
          {WHY.map((w, i) => (
            <div key={i} className="reveal" style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "30px 26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", animationDelay: `${i * 70}ms` }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", fontSize: "26px", marginBottom: "20px" }}>{w.glyph}</div>
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{w.title}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "14.5px", lineHeight: 1.8 }}>{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LearnSection() {
  return (
    <section className="section" style={{ background: "linear-gradient(180deg,var(--cream),var(--cream-2))" }}>
      <div className="wrap learn-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "56px", alignItems: "center" }}>
        <div>
          <span className="eyebrow">ماذا ستتعلّم؟</span>
          <h2 style={{ fontSize: "clamp(28px,3.5vw,40px)", margin: "16px 0 18px" }}>مهارات حقيقية تبقى مدى العمر</h2>
          <p style={{ color: "var(--ink-2)", fontSize: "17px", lineHeight: 1.85, marginBottom: "28px" }}>
            لا نكتفي بالحفظ المؤقت، بل نبني عند الطالب قدرةً راسخة على القراءة والكتابة والفهم والتلاوة، تخدمه في دراسته وحياته.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="learn-list">
            {LEARN.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                <span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0, marginTop: "2px" }}><Icon name="check" size={14} stroke={2.6} /></span>
                <span style={{ fontSize: "15px", color: "var(--ink)", fontWeight: 500, lineHeight: 1.5 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ background: "var(--navy-900)", borderRadius: "var(--r-xl)", padding: "40px", color: "#fff", boxShadow: "var(--shadow-lg)", position: "relative", overflow: "hidden" }}>
            <Ornament size={140} color="rgba(191,145,64,.12)" style={{ position: "absolute", top: "-30px", insetInlineStart: "-30px" }} />
            <span className="serif" style={{ fontSize: "44px", color: "var(--gold-400)", display: "block", marginBottom: "14px" }}>﴿ اقْرَأْ ﴾</span>
            <p className="serif" style={{ fontSize: "21px", lineHeight: 1.9, color: "#e7eef4", marginBottom: "28px" }}>
              «العربيةُ ليست مادةً تُدرَّس فحسب، بل هويةٌ تُصان، وكتابُ الله يُتلى بها. رسالتي أن أُعيدها قريبةً سهلةً محبوبةً في قلوب أبنائنا.»
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: "22px" }}>
              <img src="assets/instructor.png" alt="" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", objectPosition: "center 20%", border: "2px solid var(--gold-400)" }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px" }}>الأستاذ محمد حجاج</div>
                <div style={{ fontSize: "13px", color: "var(--gold-200)" }}>معلّم أزهري · متخصص في اللغة العربية</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoursesPreview({ ctx }) {
  return (
    <section className="section" id="courses-preview">
      <div className="wrap">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "44px", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ maxWidth: "560px" }}>
            <span className="eyebrow">مساراتنا التعليمية</span>
            <h2 style={{ fontSize: "clamp(28px,3.8vw,40px)", margin: "14px 0 12px" }}>ستة مسارات تغطّي رحلتك كاملة</h2>
            <p style={{ color: "var(--ink-2)", fontSize: "17px" }}>من تأسيس القراءة حتى حفظ القرآن الكريم — اختر مسارك وابدأ.</p>
          </div>
          <Btn variant="outline" iconAfter="arrow" onClick={() => ctx.nav("courses")}>كل الكورسات</Btn>
        </div>
        <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px" }}>
          {CATEGORIES.map((c, i) => <CategoryCard key={c.id} cat={c} ctx={ctx} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

function AccessSection() {
  return (
    <section className="section" style={{ background: "var(--cream-2)" }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">آلية الوصول للكورسات</span>
          <h2>كيف تبدأ؟ أربع خطوات بسيطة</h2>
        </div>
        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px", position: "relative" }}>
          {ACCESS_STEPS.map((s, i) => (
            <div key={s.n} className="reveal" style={{ position: "relative", animationDelay: `${i * 80}ms` }}>
              <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "30px 26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "20px" }}>{s.n.toLocaleString("ar-EG")}</span>
                  {i < 3 && <span style={{ flexGrow: 1, height: "2px", background: "repeating-linear-gradient(to left,var(--gold-200) 0 6px,transparent 6px 12px)" }} className="step-line" />}
                </div>
                <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{s.title}</h3>
                <p style={{ color: "var(--ink-2)", fontSize: "14.5px", lineHeight: 1.75 }}>{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section" style={{ background: "linear-gradient(180deg,var(--cream-2),var(--cream))", overflow: "hidden" }}>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">آراء الطلاب وأولياء الأمور</span>
          <h2>ثقةٌ نعتزّ بها</h2>
        </div>
        <div className="testi-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={i} className="reveal" style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "28px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", animationDelay: `${i * 60}ms` }}>
              <div style={{ display: "flex", gap: "3px", color: "var(--gold)", marginBottom: "16px" }}>
                {[...Array(5)].map((_, k) => <Icon key={k} name="star" size={16} />)}
              </div>
              <p style={{ fontSize: "15.5px", color: "var(--ink)", lineHeight: 1.85, marginBottom: "22px" }}>«{t.text}»</p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid var(--line-2)", paddingTop: "18px" }}>
                <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--navy-800)", color: "var(--gold-400)", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "17px" }}>{t.name.charAt(t.name.indexOf(" ") === -1 ? 0 : t.name.indexOf(" ") + 1)}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "15px", color: "var(--navy-900)" }}>{t.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqPreview({ ctx }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "860px" }}>
        <div className="section-head">
          <span className="eyebrow">الأسئلة الشائعة</span>
          <h2>أسئلة قد تدور في ذهنك</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQ.slice(0, 5).map((f, i) => (
            <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: open === i ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 24px", textAlign: "right" }}>
                <span style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--navy-900)" }}>{f.q}</span>
                <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: open === i ? "var(--gold)" : "var(--cream-2)", color: open === i ? "#fff" : "var(--navy-800)", display: "grid", placeItems: "center", transition: "all .25s", transform: open === i ? "rotate(180deg)" : "none" }}><Icon name="chevD" size={18} /></span>
              </button>
              <div style={{ maxHeight: open === i ? "420px" : "0", overflow: "hidden", transition: "max-height .35s cubic-bezier(.2,.7,.2,1)" }}>
                <p style={{ padding: "0 24px 22px", color: "var(--ink-2)", fontSize: "15px", lineHeight: 1.85 }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "28px" }}>
          <Btn variant="ghost" iconAfter="arrow" onClick={() => ctx.nav("faq")}>كل الأسئلة الشائعة</Btn>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ ctx }) {
  return (
    <section style={{ padding: "20px 24px 90px" }}>
      <div className="wrap">
        <div style={{ background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", borderRadius: "var(--r-xl)", padding: "64px 48px", textAlign: "center", position: "relative", overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          <Ornament size={200} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-50px", insetInlineStart: "-40px" }} />
          <Ornament size={160} color="rgba(191,145,64,.08)" style={{ position: "absolute", bottom: "-40px", insetInlineEnd: "-30px" }} />
          <div style={{ position: "relative" }}>
            <span className="serif" style={{ fontSize: "26px", color: "var(--gold-400)", display: "block", marginBottom: "16px" }}>﴿ بِسْمِ اللَّهِ ﴾</span>
            <h2 style={{ color: "#fff", fontSize: "clamp(28px,4vw,44px)", marginBottom: "18px", maxWidth: "720px", marginInline: "auto" }}>ابدأ رحلة أبنائك مع العربية والقرآن اليوم</h2>
            <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "560px", margin: "0 auto 34px", lineHeight: 1.8 }}>أنشئ حسابك مجاناً، عاينِ الدروس التجريبية، ثم اختر مسارك وابدأ التعلّم بثقة.</p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => ctx.nav("register")}>أنشئ حسابك الآن</Btn>
              <Btn variant="white" size="lg" icon="card" onClick={() => ctx.nav("pricing")}>الباقات والأسعار</Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage({ ctx }) {
  return (
    <>
      <Hero ctx={ctx} />
      <StatsStrip />
      <WhySection />
      <LearnSection />
      <CoursesPreview ctx={ctx} />
      <AccessSection />
      <Testimonials />
      <FaqPreview ctx={ctx} />
      <FinalCTA ctx={ctx} />
    </>
  );
}

Object.assign(window, { HomePage });
