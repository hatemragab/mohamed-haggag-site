// ============ التسجيل + الدخول + الدفع + لوحة الطالب ============

// حقل إدخال
function Field({ label, type = "text", value, onChange, placeholder, icon, error, hint }) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "block", marginBottom: "18px" }}>
      <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "8px" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--cream)", border: `1.6px solid ${error ? "var(--danger)" : focus ? "var(--gold)" : "var(--line)"}`, borderRadius: "12px", padding: "13px 16px", transition: "border-color .2s" }}>
        {icon && <Icon name={icon} size={19} style={{ color: focus ? "var(--gold-700)" : "var(--muted)" }} />}
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "15.5px", color: "var(--ink)" }} />
      </span>
      {error && <span style={{ display: "block", fontSize: "13px", color: "var(--danger)", marginTop: "6px", fontWeight: 600 }}>{error}</span>}
      {hint && !error && <span style={{ display: "block", fontSize: "12.5px", color: "var(--muted)", marginTop: "6px" }}>{hint}</span>}
    </label>
  );
}

// تخطيط صفحات الحساب (عمودان)
function AuthLayout({ children, mode, ctx }) {
  return (
    <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "24px" }}>
        <button onClick={() => ctx.nav("home")} style={{ display: "inline-flex", alignItems: "center", gap: "10px", alignSelf: "flex-start" }}>
          <span style={{ width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", display: "grid", placeItems: "center" }}>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>م</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--ink-2)", fontSize: "14px", fontWeight: 700 }}><Icon name="chevR" size={15} /> العودة للرئيسية</span>
        </button>
        <div style={{ flexGrow: 1, display: "grid", placeItems: "center", padding: "32px 0" }}>
          <div style={{ width: "100%", maxWidth: "440px" }}>{children}</div>
        </div>
      </div>
      <div className="auth-aside" style={{ background: "linear-gradient(160deg,var(--navy-700),var(--navy-900))", position: "relative", overflow: "hidden", display: "grid", placeItems: "center", padding: "56px" }}>
        <Ornament size={240} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-60px", insetInlineStart: "-50px" }} />
        <Ornament size={180} color="rgba(191,145,64,.07)" style={{ position: "absolute", bottom: "-40px", insetInlineEnd: "-30px" }} />
        <div style={{ position: "relative", color: "#fff", maxWidth: "440px", textAlign: "center" }}>
          <img src="assets/instructor.png" alt="" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", objectPosition: "center 18%", border: "4px solid var(--gold-400)", margin: "0 auto 26px", boxShadow: "var(--shadow-lg)" }} />
          <span className="serif" style={{ fontSize: "30px", color: "var(--gold-400)", display: "block", marginBottom: "16px" }}>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          <h2 style={{ color: "#fff", fontSize: "26px", marginBottom: "14px", lineHeight: 1.4 }}>{mode === "register" ? "انضمّ إلى آلاف الطلاب اليوم" : "أهلاً بعودتك من جديد"}</h2>
          <p style={{ color: "#c5d2dd", fontSize: "16px", lineHeight: 1.85 }}>{mode === "register" ? "أنشئ حسابك مجاناً وابدأ رحلتك في تعلّم العربية والقرآن مع معلّمٍ أزهري موثوق." : "سجّل الدخول لمتابعة دروسك ومواصلة تقدّمك من حيث توقّفت."}</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "34px", flexWrap: "wrap" }}>
            {[["٨٥٠+", "طالب"], ["٦٤٠+", "درس"], ["٪٩٨", "رضا"]].map(([v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "14px", padding: "14px 22px" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "var(--gold-400)" }}>{v}</div>
                <div style={{ fontSize: "12.5px", color: "#9fb0bf" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// تسجيل حساب جديد
function RegisterPage({ ctx }) {
  const [f, setF] = useState({ name: "", email: "", pass: "", phone: "" });
  const [err, setErr] = useState({});
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 3) er.name = "يرجى إدخال الاسم كاملاً";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "بريد إلكتروني غير صحيح";
    if (f.pass.length < 6) er.pass = "كلمة المرور ٦ أحرف على الأقل";
    setErr(er);
    if (Object.keys(er).length === 0) ctx.login(f.name, f.email);
  };
  return (
    <AuthLayout mode="register" ctx={ctx}>
      <Badge tone="gold" style={{ marginBottom: "18px" }}>حساب جديد · مجاناً</Badge>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>أنشئ حسابك الآن</h1>
      <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "30px" }}>أنشئ حسابك في أقل من دقيقة وابدأ بمعاينة الدروس التجريبية مجاناً.</p>
      <form onSubmit={submit}>
        <Field label="الاسم الكامل" icon="user" value={f.name} onChange={set("name")} placeholder="مثال: عبدالله محمد" error={err.name} />
        <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={set("email")} placeholder="you@example.com" error={err.email} />
        <Field label="رقم الهاتف (اختياري)" icon="phone" value={f.phone} onChange={set("phone")} placeholder="+971 5X XXX XXXX" />
        <Field label="كلمة المرور" type="password" icon="lock" value={f.pass} onChange={set("pass")} placeholder="••••••••" error={err.pass} hint="٦ أحرف على الأقل" />
        <Btn variant="gold" size="lg" full type="submit" iconAfter="arrow">إنشاء الحساب</Btn>
      </form>
      <div style={{ textAlign: "center", marginTop: "22px", fontSize: "14.5px", color: "var(--ink-2)" }}>
        لديك حساب بالفعل؟ <button onClick={() => ctx.nav("login")} style={{ color: "var(--gold-700)", fontWeight: 800 }}>سجّل الدخول</button>
      </div>
      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.7 }}>بإنشائك حساباً فأنت توافق على <button onClick={() => ctx.nav("terms")} style={{ color: "var(--navy-700)", fontWeight: 700, textDecoration: "underline" }}>الشروط وسياسة الخصوصية</button></p>
    </AuthLayout>
  );
}

// تسجيل الدخول
function LoginPage({ ctx }) {
  const [f, setF] = useState({ email: "", pass: "" });
  const [err, setErr] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "بريد إلكتروني غير صحيح";
    if (f.pass.length < 1) er.pass = "أدخل كلمة المرور";
    setErr(er);
    if (Object.keys(er).length === 0) ctx.login(f.email.split("@")[0], f.email);
  };
  return (
    <AuthLayout mode="login" ctx={ctx}>
      <Badge tone="gold" style={{ marginBottom: "18px" }}>تسجيل الدخول</Badge>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>أهلاً بعودتك</h1>
      <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "30px" }}>سجّل الدخول لمتابعة دروسك من حيث توقّفت.</p>
      <form onSubmit={submit}>
        <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" error={err.email} />
        <Field label="كلمة المرور" type="password" icon="lock" value={f.pass} onChange={e => setF({ ...f, pass: e.target.value })} placeholder="••••••••" error={err.pass} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", fontSize: "14px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ink-2)", cursor: "pointer", fontWeight: 600 }}>
            <input type="checkbox" style={{ width: 17, height: 17, accentColor: "var(--gold)" }} /> تذكّرني
          </label>
          <button type="button" style={{ color: "var(--gold-700)", fontWeight: 700 }}>نسيت كلمة المرور؟</button>
        </div>
        <Btn variant="primary" size="lg" full type="submit" iconAfter="arrow">دخول</Btn>
      </form>
      <div style={{ textAlign: "center", marginTop: "22px", fontSize: "14.5px", color: "var(--ink-2)" }}>
        ليس لديك حساب؟ <button onClick={() => ctx.nav("register")} style={{ color: "var(--gold-700)", fontWeight: 800 }}>أنشئ حساباً جديداً</button>
      </div>
    </AuthLayout>
  );
}

// الباقات والأسعار
function PricingPage({ ctx }) {
  const [cur, setCur] = useState(CURRENCIES[0]);
  return (
    <div>
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "56px 0 130px", position: "relative", overflow: "hidden", textAlign: "center" }}>
        <Ornament size={200} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-40px", insetInlineEnd: "8%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>الباقات والأسعار</Badge>
          <h1 style={{ color: "#fff", fontSize: "clamp(30px,4vw,46px)", marginBottom: "14px" }}>اختر ما يناسبك وابدأ التعلّم</h1>
          <p style={{ color: "#c5d2dd", fontSize: "18px", maxWidth: "580px", margin: "0 auto 30px", lineHeight: 1.8 }}>أسعار واضحة بلا رسوم خفية. دورة واحدة، أو اشتراك شهري مرن، أو حزمة كاملة بأفضل قيمة.</p>
          {/* مبدّل العملة */}
          <div style={{ display: "inline-flex", gap: "4px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: "999px", padding: "5px" }}>
            {CURRENCIES.map(c => (
              <button key={c.code} onClick={() => setCur(c)} style={{ padding: "9px 22px", borderRadius: "999px", fontSize: "14px", fontWeight: 800, transition: "all .2s", background: cur.code === c.code ? "var(--gold)" : "transparent", color: cur.code === c.code ? "var(--navy-900)" : "#cdd7e0" }}>{c.name}</button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: "-90px", paddingBottom: "90px", position: "relative" }}>
        <div className="wrap">
          <div className="plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "24px", alignItems: "stretch" }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ background: p.highlight ? "linear-gradient(170deg,var(--navy-800),var(--navy-900))" : "var(--paper)", borderRadius: "var(--r-xl)", padding: "34px 30px", border: p.highlight ? "none" : "1px solid var(--line)", boxShadow: p.highlight ? "var(--shadow-lg)" : "var(--shadow)", position: "relative", transform: p.highlight ? "scale(1.03)" : "none", color: p.highlight ? "#fff" : "var(--ink)", display: "flex", flexDirection: "column" }} className="plan-card">
                {p.highlight && <div style={{ position: "absolute", top: "-14px", insetInlineStart: "50%", transform: "translateX(50%)", background: "var(--gold)", color: "var(--navy-900)", fontSize: "13px", fontWeight: 800, padding: "6px 18px", borderRadius: "999px", boxShadow: "var(--shadow)" }}>الأكثر اختياراً</div>}
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: p.highlight ? "var(--gold-400)" : "var(--gold-700)", marginBottom: "6px" }}>{p.tagline}</div>
                <h3 style={{ fontSize: "23px", color: p.highlight ? "#fff" : "var(--navy-900)", marginBottom: "16px" }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "42px", fontWeight: 900, color: p.highlight ? "#fff" : "var(--navy-900)", lineHeight: 1 }}>{p[cur.key].toLocaleString("ar-EG")}</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: p.highlight ? "var(--gold-400)" : "var(--gold-700)" }}>{cur.label}</span>
                </div>
                <div style={{ fontSize: "14px", color: p.highlight ? "#9fb0bf" : "var(--muted)", marginBottom: "26px" }}>{p.period}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "28px", flexGrow: 1 }}>
                  {p.features.map((ft, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "11px", fontSize: "14.5px", lineHeight: 1.5, color: p.highlight ? "#dde6ee" : "var(--ink-2)" }}>
                      <span style={{ width: 22, height: 22, borderRadius: "50%", background: p.highlight ? "rgba(191,145,64,.25)" : "#e4efe9", color: p.highlight ? "var(--gold-400)" : "var(--green)", display: "grid", placeItems: "center", flexShrink: 0, marginTop: "1px" }}><Icon name="check" size={13} stroke={2.6} /></span>
                      {ft}
                    </div>
                  ))}
                </div>
                <Btn variant={p.highlight ? "gold" : "primary"} size="lg" full iconAfter="arrow" onClick={() => ctx.openCheckout(p.id)}>{p.cta}</Btn>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px", display: "flex", gap: "28px", justifyContent: "center", flexWrap: "wrap", color: "var(--ink-2)", fontSize: "14.5px", fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="shield" size={18} style={{ color: "var(--green)" }} /> دفع آمن ومشفّر</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="check" size={18} style={{ color: "var(--green)" }} /> ضمان استرداد ٧ أيام</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}><Icon name="card" size={18} style={{ color: "var(--green)" }} /> بطاقات ومحافظ إلكترونية</span>
          </div>
        </div>
      </section>
    </div>
  );
}

// صفحة الدفع (Checkout) — modal-like full page
function CheckoutPage({ ctx }) {
  const { params, user, nav, completePurchase } = ctx;
  const plan = PLANS.find(p => p.id === params.planId) || PLANS[0];
  const cat = params.catId ? CATEGORIES.find(c => c.id === params.catId) : null;
  const [cur, setCur] = useState(CURRENCIES[0]);
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ num: "", name: "", exp: "", cvc: "" });
  const [stage, setStage] = useState("form"); // form | processing | done
  const price = plan[cur.key];

  if (!user) {
    return (
      <div className="wrap" style={{ padding: "80px 24px", textAlign: "center", maxWidth: "520px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", margin: "0 auto 24px" }}><Icon name="user" size={36} /></div>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>سجّل الدخول لإتمام الدفع</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>تحتاج إلى حساب لإتمام عملية الشراء وفتح الكورسات.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Btn variant="gold" size="lg" onClick={() => nav("register")}>أنشئ حساباً</Btn>
          <Btn variant="outline" size="lg" onClick={() => nav("login")}>تسجيل الدخول</Btn>
        </div>
      </div>
    );
  }

  const pay = (e) => {
    e.preventDefault();
    setStage("processing");
    setTimeout(() => { setStage("done"); completePurchase(plan.id, params.catId); }, 1900);
  };

  if (stage === "done") {
    return (
      <div className="wrap" style={{ padding: "70px 24px", maxWidth: "560px", textAlign: "center" }}>
        <div style={{ animation: "scaleIn .5s both" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 26px", boxShadow: "0 10px 30px rgba(63,125,94,.35)" }}><Icon name="check" size={50} stroke={2.4} /></div>
          <span className="serif" style={{ fontSize: "26px", color: "var(--gold-700)", display: "block", marginBottom: "12px" }}>﴿ بَارَكَ اللَّهُ فِيكَ ﴾</span>
          <h1 style={{ fontSize: "32px", marginBottom: "14px" }}>تم الدفع بنجاح!</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "17px", lineHeight: 1.8, marginBottom: "10px" }}>تم تفعيل {cat ? `مسار «${cat.title}»` : `باقة «${plan.name}»`} في حسابك. أُرسِل إيصالٌ إلى بريدك الإلكتروني.</p>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "32px" }}>يمكنك الآن مشاهدة جميع الدروس المتاحة فوراً.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => nav(cat ? "category" : "courses", cat ? { catId: cat.id } : {})}>ابدأ المشاهدة</Btn>
            <Btn variant="outline" size="lg" icon="grid" onClick={() => nav("dashboard")}>لوحة الطالب</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)" }}>
      <div className="wrap" style={{ padding: "40px 24px 80px" }}>
        <button onClick={() => nav("pricing")} style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--muted)", fontSize: "14px", fontWeight: 700, marginBottom: "24px" }}><Icon name="chevR" size={16} /> رجوع للباقات</button>
        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "32px", alignItems: "start" }}>
          {/* نموذج الدفع */}
          <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "34px", boxShadow: "var(--shadow-sm)" }}>
            <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>إتمام الدفع</h1>
            <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "26px" }}>أكمل بياناتك لإتمام الاشتراك بأمان.</p>

            {/* العملة */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>العملة</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {CURRENCIES.map(c => (
                  <button key={c.code} onClick={() => setCur(c)} style={{ padding: "10px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, background: cur.code === c.code ? "var(--navy-800)" : "var(--cream-2)", color: cur.code === c.code ? "#fff" : "var(--ink-2)" }}>{c.name}</button>
                ))}
              </div>
            </div>

            {/* طريقة الدفع */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>طريقة الدفع</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {[["card", "بطاقة بنكية", "card"], ["wallet", "محفظة إلكترونية", "phone"], ["bank", "تحويل بنكي", "shield"]].map(([id, label, ic]) => (
                  <button key={id} onClick={() => setMethod(id)} style={{ padding: "16px 12px", borderRadius: "12px", border: `1.6px solid ${method === id ? "var(--gold)" : "var(--line)"}`, background: method === id ? "var(--gold-100)" : "var(--cream)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all .2s" }}>
                    <Icon name={ic} size={22} style={{ color: method === id ? "var(--gold-700)" : "var(--muted)" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: method === id ? "var(--navy-900)" : "var(--ink-2)" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === "card" && (
              <form onSubmit={pay}>
                <Field label="رقم البطاقة" icon="card" value={card.num} onChange={e => setCard({ ...card, num: e.target.value })} placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢" />
                <Field label="الاسم على البطاقة" icon="user" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} placeholder="MOHAMMED HAGGAG" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Field label="تاريخ الانتهاء" value={card.exp} onChange={e => setCard({ ...card, exp: e.target.value })} placeholder="MM / YY" />
                  <Field label="CVC" type="password" value={card.cvc} onChange={e => setCard({ ...card, cvc: e.target.value })} placeholder="•••" />
                </div>
                <Btn variant="gold" size="lg" full type="submit" icon="lock" style={{ marginTop: "8px" }}>ادفع {price.toLocaleString("ar-EG")} {cur.label} بأمان</Btn>
              </form>
            )}
            {method !== "card" && (
              <div style={{ textAlign: "center", padding: "30px 20px", background: "var(--cream)", borderRadius: "var(--r)", border: "1px dashed var(--line)" }}>
                <Icon name={method === "wallet" ? "phone" : "shield"} size={40} style={{ color: "var(--gold)", margin: "0 auto 14px" }} />
                <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "20px" }}>{method === "wallet" ? "سيتم تحويلك إلى المحفظة الإلكترونية لإتمام الدفع." : "ستظهر تفاصيل الحساب البنكي لإتمام التحويل."}</p>
                <Btn variant="gold" size="lg" full icon="lock" onClick={pay}>متابعة الدفع</Btn>
              </div>
            )}
            {stage === "processing" && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(10,31,54,.6)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 99 }}>
                <div style={{ background: "#fff", borderRadius: "var(--r-lg)", padding: "44px 56px", textAlign: "center", boxShadow: "var(--shadow-lg)" }}>
                  <div className="ring" style={{ width: 54, height: 54, border: "3px solid var(--gold-200)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
                  <div style={{ fontWeight: 800, fontSize: "18px", color: "var(--navy-900)" }}>جارٍ معالجة الدفع…</div>
                  <div style={{ color: "var(--muted)", fontSize: "14px", marginTop: "6px" }}>يرجى عدم إغلاق الصفحة</div>
                </div>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "center", marginTop: "20px", color: "var(--muted)", fontSize: "13px" }}>
              <Icon name="lock" size={15} /> جميع المعاملات مشفّرة وآمنة
            </div>
          </div>

          {/* ملخّص الطلب */}
          <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "30px", boxShadow: "var(--shadow-sm)", position: "sticky", top: "92px" }}>
            <h3 style={{ fontSize: "19px", marginBottom: "20px" }}>ملخّص الطلب</h3>
            <div style={{ display: "flex", gap: "14px", paddingBottom: "20px", borderBottom: "1px solid var(--line-2)", marginBottom: "20px" }}>
              <span style={{ width: 58, height: 58, borderRadius: "15px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <span className="serif" style={{ fontSize: "26px" }}>{cat ? cat.glyph : "❖"}</span>
              </span>
              <div>
                <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--navy-900)" }}>{cat ? cat.title : plan.name}</div>
                <div style={{ fontSize: "13.5px", color: "var(--muted)", marginTop: "2px" }}>{cat ? "وصول كامل للمسار" : plan.period}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}><span>{cat ? "وصول كامل للمسار" : plan.period}</span><span>{price.toLocaleString("ar-EG")} {cur.label}</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "18px", borderTop: "2px solid var(--line)" }}>
              <span style={{ fontWeight: 800, fontSize: "17px", color: "var(--navy-900)" }}>الإجمالي</span>
              <span style={{ fontWeight: 900, fontSize: "26px", color: "var(--navy-900)" }}>{price.toLocaleString("ar-EG")} <span style={{ fontSize: "16px", color: "var(--gold-700)" }}>{cur.label}</span></span>
            </div>
            <div style={{ marginTop: "22px", padding: "16px", background: "var(--cream)", borderRadius: "var(--r)", display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <Icon name="shield" size={20} style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }} />
              <span style={{ fontSize: "13px", color: "var(--ink-2)", lineHeight: 1.6 }}>ضمان استرداد كامل خلال ٧ أيام إذا لم يعجبك المحتوى.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RegisterPage, LoginPage, PricingPage, CheckoutPage, Field });
