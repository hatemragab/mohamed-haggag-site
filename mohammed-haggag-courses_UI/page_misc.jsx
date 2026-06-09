// ============ لوحة الطالب + عن الأستاذ + FAQ + تواصل + الشروط ============

// لوحة الطالب
function DashboardPage({ ctx }) {
  const { user, unlocked, nav, continueList, progress, openCheckout } = ctx;
  if (!user) { useEffect(() => ctx.nav("login"), []); return null; }
  const myCats = CATEGORIES.filter(c => ctx.isUnlocked(c.id));
  const lockedCats = CATEGORIES.filter(c => !ctx.isUnlocked(c.id));
  const doneCount = Object.keys(progress).filter(k => progress[k]).length;

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)" }}>
      {/* ترحيب */}
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "44px 0 40px", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-50px", insetInlineEnd: "5%" }} />
        <div className="wrap" style={{ position: "relative", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", color: "var(--navy-900)", display: "grid", placeItems: "center", fontSize: "30px", fontWeight: 900, flexShrink: 0 }}>{user.name.charAt(0)}</span>
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: "14px", color: "var(--gold-200)", fontWeight: 700 }}>أهلاً بك مجدداً</div>
            <h1 style={{ color: "#fff", fontSize: "30px" }}>{user.name}</h1>
          </div>
          <Btn variant="gold" icon="grid" onClick={() => nav("courses")}>تصفّح الكورسات</Btn>
        </div>
      </section>

      <div className="wrap" style={{ padding: "36px 24px 80px" }}>
        {/* إحصاءات الطالب */}
        <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px", marginBottom: "40px" }}>
          {[
            { ic: "unlock", v: myCats.length, l: "مسارات مفتوحة", c: "var(--green)" },
            { ic: "check", v: doneCount, l: "دروس مكتملة", c: "var(--gold-700)" },
            { ic: "clock", v: continueList.length, l: "قيد المتابعة", c: "var(--navy-600)" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", padding: "22px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: 50, height: 50, borderRadius: "14px", background: "var(--cream-2)", color: s.c, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={s.ic} size={24} /></span>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--navy-900)", lineHeight: 1 }}>{s.v.toLocaleString("ar-EG")}</div>
                <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* متابعة المشاهدة */}
        {continueList.length > 0 && (
          <div style={{ marginBottom: "44px" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="play" size={20} style={{ color: "var(--gold-700)" }} /> أكمل المشاهدة</h2>
            <div className="continue-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "18px" }}>
              {continueList.slice(0, 4).map((item, i) => {
                const cat = CATEGORIES.find(c => c.id === item.catId);
                if (!cat) return null;
                // إعادة بناء قائمة دروس الوحدة من معرّف الدرس: catId-subId-idx (الـ subId قد يحتوي شرطات)
                const parts = item.lesson.id.split("-");
                const subId = parts.slice(1, parts.length - 1).join("-");
                const lessons = genLessons(item.catId, subId, item.subTitle);
                return (
                  <button key={i} onClick={() => nav("lesson", { catId: item.catId, lesson: item.lesson, lessons, subTitle: item.subTitle })}
                    style={{ display: "flex", gap: "16px", background: "var(--paper)", borderRadius: "var(--r)", padding: "16px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", textAlign: "right", transition: "transform .2s", alignItems: "center" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                    <span style={{ width: 64, height: 64, borderRadius: "13px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="play" size={26} /></span>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12.5px", color: "var(--gold-700)", fontWeight: 700, marginBottom: "3px" }}>{cat.title}</div>
                      <div style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--navy-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.lesson.title}</div>
                      <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>{item.subTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* كورساتي المفتوحة */}
        <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="unlock" size={20} style={{ color: "var(--green)" }} /> كورساتي</h2>
        {myCats.length === 0 ? (
          <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: "56px 24px", textAlign: "center" }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}><Icon name="lock" size={34} /></div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>لم تفتح أي مسار بعد</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "24px", maxWidth: "420px", margin: "0 auto 24px" }}>اختر مساراً أو باقة لتفتح الدروس وتبدأ رحلة التعلّم. الدرس الأول من كل وحدة متاح للمعاينة مجاناً.</p>
            <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => nav("pricing")}>استعرض الباقات</Btn>
          </div>
        ) : (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px", marginBottom: "44px" }}>
            {myCats.map(c => {
              const subCount = c.groups ? c.groups.reduce((a, g) => a + g.subs.length, 0) : c.subs.length;
              return (
                <button key={c.id} onClick={() => nav("category", { catId: c.id })} style={{ textAlign: "right", background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", transition: "transform .2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ width: 56, height: 56, borderRadius: "15px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center" }}><span className="serif" style={{ fontSize: "27px" }}>{c.glyph}</span></span>
                    <Badge tone="green"><Icon name="unlock" size={13} /> مُفعّل</Badge>
                  </div>
                  <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{c.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "16px" }}>{subCount.toLocaleString("ar-EG")} مستوى تعليمي</p>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--navy-700)", fontWeight: 800, fontSize: "14.5px" }}>تابع التعلّم <Icon name="arrow" size={16} /></span>
                </button>
              );
            })}
          </div>
        )}

        {/* مقترحات لفتحها */}
        {lockedCats.length > 0 && (
          <>
            <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="sparkle" size={20} style={{ color: "var(--gold-700)" }} /> وسّع آفاقك</h2>
            <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
              {lockedCats.slice(0, 3).map(c => (
                <div key={c.id} style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ width: 56, height: 56, borderRadius: "15px", background: "var(--cream-2)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><span className="serif" style={{ fontSize: "27px" }}>{c.glyph}</span></span>
                    <Badge tone="line"><Icon name="lock" size={13} /> مغلق</Badge>
                  </div>
                  <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{c.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "16px" }}>{c.tagline}</p>
                  <Btn variant="outline" size="sm" full icon="unlock" onClick={() => openCheckout("single", c.id)}>افتح المسار</Btn>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// عن الأستاذ
function AboutPage({ ctx }) {
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,#fdfaf4,#f3ecdf)", padding: "64px 0", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-40px" }} />
        <div className="wrap about-grid" style={{ display: "grid", gridTemplateColumns: ".85fr 1.15fr", gap: "48px", alignItems: "center", position: "relative" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "16px -12px -16px 16px", borderRadius: "var(--r-xl)", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", transform: "rotate(2.5deg)" }} />
            <img src="assets/instructor.png" alt="الأستاذ محمد حجاج" style={{ position: "relative", width: "100%", borderRadius: "var(--r-xl)", border: "5px solid #fff", boxShadow: "var(--shadow-lg)", aspectRatio: "696/900", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <Badge tone="gold" style={{ marginBottom: "16px" }}>عن الأستاذ</Badge>
            <h1 style={{ fontSize: "clamp(30px,4vw,46px)", marginBottom: "10px" }}>{INSTRUCTOR.name}</h1>
            <p style={{ color: "var(--gold-700)", fontSize: "17px", fontWeight: 700, marginBottom: "22px" }}>{INSTRUCTOR.title}</p>
            {INSTRUCTOR.bio.map((p, i) => (
              <p key={i} style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.95, marginBottom: "16px" }}>{p}</p>
            ))}
            <div style={{ display: "flex", gap: "14px", marginTop: "26px", flexWrap: "wrap" }}>
              <Btn variant="gold" iconAfter="arrow" onClick={() => ctx.nav("courses")}>استعرض كورساته</Btn>
              <Btn variant="outline" icon="mail" onClick={() => ctx.nav("contact")}>تواصل معه</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* المؤهّلات */}
      <section className="section">
        <div className="wrap">
          <div className="about-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px" }}>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>المؤهّلات والخبرة</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {INSTRUCTOR.credentials.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", background: "var(--paper)", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
                    <span style={{ width: 42, height: 42, borderRadius: "12px", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="cap" size={21} /></span>
                    <span style={{ fontSize: "15.5px", fontWeight: 600, color: "var(--ink)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: "28px", marginBottom: "24px" }}>بالأرقام</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {INSTRUCTOR.stats.map((s, i) => (
                  <div key={i} style={{ background: "linear-gradient(160deg,var(--navy-700),var(--navy-900))", borderRadius: "var(--r-lg)", padding: "26px", color: "#fff", textAlign: "center" }}>
                    <div style={{ fontSize: "34px", fontWeight: 900, color: "var(--gold-400)", lineHeight: 1 }}><Counter value={s.value} suffix={s.suffix} /></div>
                    <div style={{ fontSize: "13.5px", color: "#9fb0bf", marginTop: "8px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// الأسئلة الشائعة (كامل)
function FaqPage({ ctx }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <Ornament size={180} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-40px", insetInlineEnd: "10%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>الأسئلة الشائعة</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,44px)", marginBottom: "12px" }}>كل ما تريد معرفته</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "560px", margin: "0 auto" }}>إجابات واضحة على أكثر الأسئلة شيوعاً من الطلاب وأولياء الأمور.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "820px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: open === i ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
                <button onClick={() => setOpen(open === i ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "20px 24px", textAlign: "right" }}>
                  <span style={{ fontSize: "16.5px", fontWeight: 700, color: "var(--navy-900)" }}>{f.q}</span>
                  <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: open === i ? "var(--gold)" : "var(--cream-2)", color: open === i ? "#fff" : "var(--navy-800)", display: "grid", placeItems: "center", transition: "all .25s", transform: open === i ? "rotate(180deg)" : "none" }}><Icon name="chevD" size={18} /></span>
                </button>
                <div style={{ maxHeight: open === i ? "420px" : "0", overflow: "hidden", transition: "max-height .35s cubic-bezier(.2,.7,.2,1)" }}>
                  <p style={{ padding: "0 24px 22px", color: "var(--ink-2)", fontSize: "15.5px", lineHeight: 1.9 }}>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "40px", background: "var(--cream-2)", borderRadius: "var(--r-lg)", padding: "36px", textAlign: "center" }}>
            <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>لم تجد إجابتك؟</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "22px" }}>فريقنا سعيد بمساعدتك في أي وقت.</p>
            <Btn variant="primary" icon="mail" onClick={() => ctx.nav("contact")}>تواصل معنا</Btn>
          </div>
        </div>
      </section>
    </div>
  );
}

// تواصل معنا
function ContactPage({ ctx }) {
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", email: "", msg: "" });
  return (
    <div className="wrap" style={{ padding: "56px 24px 90px" }}>
      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start" }}>
        <div>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>تواصل معنا</Badge>
          <h1 style={{ fontSize: "clamp(28px,3.6vw,40px)", marginBottom: "14px" }}>نسعد بتواصلك معنا</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.85, marginBottom: "30px" }}>سواء كنت طالباً أو ولي أمر، فريقنا جاهز للإجابة على استفساراتك ومساعدتك في اختيار المسار المناسب.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { ic: "mail", label: "البريد الإلكتروني", val: "info@haggag-academy.com" },
              { ic: "whatsapp", label: "واتساب", val: "+971 5X XXX XXXX" },
              { ic: "phone", label: "الهاتف", val: "+20 1X XXXX XXXX" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "var(--paper)", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ width: 48, height: 48, borderRadius: "13px", background: "var(--navy-900)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={c.ic} size={22} /></span>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy-900)", direction: "ltr", textAlign: "right" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "36px", boxShadow: "var(--shadow)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0", animation: "scaleIn .5s both" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 22px" }}><Icon name="check" size={42} stroke={2.4} /></div>
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>تم إرسال رسالتك!</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "26px" }}>سنتواصل معك في أقرب وقت. شكراً لتواصلك.</p>
              <Btn variant="outline" onClick={() => { setSent(false); setF({ name: "", email: "", msg: "" }); }}>إرسال رسالة أخرى</Btn>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <h3 style={{ fontSize: "22px", marginBottom: "22px" }}>أرسل لنا رسالة</h3>
              <Field label="الاسم" icon="user" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="اسمك الكامل" />
              <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
              <label style={{ display: "block", marginBottom: "18px" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "8px" }}>رسالتك</span>
                <textarea value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} placeholder="كيف يمكننا مساعدتك؟" rows={5} style={{ width: "100%", border: "1.6px solid var(--line)", borderRadius: "12px", padding: "14px 16px", fontSize: "15.5px", background: "var(--cream)", outline: "none", resize: "vertical", color: "var(--ink)" }} onFocus={e => e.target.style.borderColor = "var(--gold)"} onBlur={e => e.target.style.borderColor = "var(--line)"} />
              </label>
              <Btn variant="gold" size="lg" full type="submit" iconAfter="arrow">إرسال الرسالة</Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// الشروط والخصوصية
function TermsPage({ ctx }) {
  const sections = [
    { t: "مقدّمة", b: "مرحباً بك في منصة الأستاذ محمد حجاج التعليمية. باستخدامك للمنصة وإنشائك حساباً، فإنك توافق على الشروط والأحكام الموضّحة أدناه. يرجى قراءتها بعناية." },
    { t: "الحساب والتسجيل", b: "أنت مسؤول عن الحفاظ على سرّية بيانات حسابك وكلمة المرور. يُمنع مشاركة الحساب أو بيانات الدخول مع الغير، ويحق للمنصة إيقاف أي حساب يُساء استخدامه." },
    { t: "المحتوى والملكية الفكرية", b: "جميع الدروس والفيديوهات والمواد التعليمية مملوكة للمنصة ومحمية بحقوق الملكية الفكرية. يُمنع تحميلها أو إعادة نشرها أو توزيعها أو بيعها بأي شكل دون إذن خطّي مسبق." },
    { t: "الدفع والاشتراكات", b: "تتم جميع المدفوعات عبر بوابات دفع آمنة ومشفّرة. يُفعّل الوصول للكورسات مباشرةً بعد إتمام الدفع. يمكن إلغاء الاشتراك الشهري في أي وقت دون التزامات مستقبلية." },
    { t: "سياسة الاسترداد", b: "نوفّر ضمان استرداد كامل خلال سبعة أيام من تاريخ الشراء إذا لم يكن المحتوى مناسباً لك، بشرط عدم إكمال أكثر من ٢٠٪ من دروس المسار." },
    { t: "الخصوصية وحماية البيانات", b: "نلتزم بحماية بياناتك الشخصية وعدم مشاركتها مع أي طرف ثالث لأغراض تسويقية. تُستخدم بياناتك فقط لتقديم الخدمة التعليمية وتحسين تجربتك." },
    { t: "حقوق القاصرين", b: "يُشترط لاستخدام المنصة من قبل القاصرين موافقة وإشراف ولي الأمر. نحرص على تقديم محتوى تعليمي آمن ومناسب لجميع الأعمار." },
    { t: "تعديل الشروط", b: "يحق للمنصة تحديث هذه الشروط من وقت لآخر، وسيتم إشعار المستخدمين بأي تغييرات جوهرية عبر البريد الإلكتروني أو المنصة." },
  ];
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "52px 0", position: "relative", overflow: "hidden" }}>
        <Ornament size={160} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-30px", insetInlineEnd: "8%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>الشروط والخصوصية</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(28px,3.6vw,40px)", marginBottom: "10px" }}>الشروط والأحكام وسياسة الخصوصية</h1>
          <p style={{ color: "#9fb0bf", fontSize: "15px" }}>آخر تحديث: يونيو ٢٠٢٦</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "820px" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "21px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: 32, height: 32, borderRadius: "9px", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", fontSize: "15px", fontWeight: 900, flexShrink: 0 }}>{(i + 1).toLocaleString("ar-EG")}</span>
                {s.t}
              </h2>
              <p style={{ color: "var(--ink-2)", fontSize: "16px", lineHeight: 1.95, paddingInlineStart: "44px" }}>{s.b}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { DashboardPage, AboutPage, FaqPage, ContactPage, TermsPage });
