// ============ لوحة تحكم الأدمن ============

// ---- عناصر إدارية مشتركة ----
function AInput({ label, value, onChange, type = "text", placeholder, full, mono, autoFocus, after }) {
  return (
    <label style={{ display: "block", marginBottom: "14px", width: full ? "100%" : "auto" }}>
      {label && <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cdd7e0", marginBottom: "6px" }}>{label}</span>}
      <span style={{ position: "relative", display: "block" }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} autoFocus={autoFocus}
          style={{ width: "100%", background: "#0c2235", border: "1.5px solid #1d3954", borderRadius: "10px", padding: after ? "11px 14px 11px 44px" : "11px 14px", fontSize: "14.5px", color: "#fff", outline: "none", fontFamily: mono ? "ui-monospace,monospace" : "inherit", direction: mono ? "ltr" : "rtl" }}
          onFocus={e => e.target.style.borderColor = "var(--gold)"} onBlur={e => e.target.style.borderColor = "#1d3954"} />
        {after && <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px", display: "grid", placeItems: "center" }}>{after}</span>}
      </span>
    </label>
  );
}
function AArea({ label, value, onChange, rows = 3 }) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      {label && <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cdd7e0", marginBottom: "6px" }}>{label}</span>}
      <textarea value={value} onChange={onChange} rows={rows}
        style={{ width: "100%", background: "#0c2235", border: "1.5px solid #1d3954", borderRadius: "10px", padding: "11px 14px", fontSize: "14.5px", color: "#fff", outline: "none", resize: "vertical", lineHeight: 1.7 }}
        onFocus={e => e.target.style.borderColor = "var(--gold)"} onBlur={e => e.target.style.borderColor = "#1d3954"} />
    </label>
  );
}
function ASelect({ label, value, onChange, options }) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      {label && <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "#cdd7e0", marginBottom: "6px" }}>{label}</span>}
      <select value={value} onChange={onChange}
        style={{ width: "100%", background: "#0c2235", border: "1.5px solid #1d3954", borderRadius: "10px", padding: "11px 14px", fontSize: "14.5px", color: "#fff", outline: "none" }}>
        {options.map(o => <option key={o.v} value={o.v} style={{ background: "#0c2235" }}>{o.l}</option>)}
      </select>
    </label>
  );
}
function AToggle({ on, onClick, label }) {
  return (
    <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "9px", color: "#cdd7e0", fontSize: "13.5px", fontWeight: 700 }}>
      <span style={{ width: 38, height: 22, borderRadius: "999px", background: on ? "var(--gold)" : "#1d3954", position: "relative", transition: "background .2s" }}>
        <span style={{ position: "absolute", top: 2, insetInlineStart: on ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} />
      </span>
      {label}
    </button>
  );
}
function ABtn({ children, onClick, tone = "gold", size = "md", icon, type = "button", full }) {
  const tones = {
    gold: { background: "linear-gradient(180deg,var(--gold-400),var(--gold))", color: "var(--navy-900)" },
    ghost: { background: "#173248", color: "#cdd7e0" },
    danger: { background: "rgba(180,69,47,.16)", color: "#e88a76", boxShadow: "inset 0 0 0 1px rgba(180,69,47,.4)" },
    outline: { background: "transparent", color: "#cdd7e0", boxShadow: "inset 0 0 0 1.5px #2a4863" },
  };
  const sizes = { sm: "8px 14px", md: "11px 20px" };
  return (
    <button type={type} onClick={onClick} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", borderRadius: "10px", fontWeight: 700, fontSize: size === "sm" ? "13px" : "14.5px", padding: sizes[size], cursor: "pointer", transition: "filter .2s, transform .1s", width: full ? "100%" : "auto", ...tones[tone] }}
      onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.08)"} onMouseLeave={e => e.currentTarget.style.filter = "none"}>
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}{children}
    </button>
  );
}
function AModal({ title, onClose, children, wide }) {
  useEffect(() => {
    const f = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(5,16,28,.7)", backdropFilter: "blur(4px)", display: "grid", placeItems: "center", zIndex: 200, padding: "20px" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0e2944", border: "1px solid #1d3954", borderRadius: "18px", width: "100%", maxWidth: wide ? "640px" : "460px", maxHeight: "88vh", overflow: "auto", boxShadow: "0 30px 80px rgba(0,0,0,.5)", animation: "scaleIn .25s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #1d3954", position: "sticky", top: 0, background: "#0e2944", zIndex: 1 }}>
          <h3 style={{ color: "#fff", fontSize: "18px" }}>{title}</h3>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "#cdd7e0", display: "grid", placeItems: "center" }}><Icon name="x" size={18} /></button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}
function ACard({ children, style }) {
  return <div style={{ background: "#0e2944", border: "1px solid #1d3954", borderRadius: "16px", padding: "22px", ...style }}>{children}</div>;
}
function confirmDel(msg) { return window.confirm(msg); }

// ---- تسجيل دخول الأدمن ----
function AdminLoginPage({ ctx }) {
  const [f, setF] = useState({ user: "", pass: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (f.user === ADMIN_CREDS.user && f.pass === ADMIN_CREDS.pass) { setErr(""); ctx.adminLogin(); }
    else setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
  };
  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 30% 20%, #143655, #0a1f36 60%)", display: "grid", placeItems: "center", padding: "24px", direction: "rtl" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <button onClick={() => ctx.nav("home")} style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#9fb0bf", fontSize: "13.5px", fontWeight: 700, marginBottom: "26px" }}><Icon name="chevR" size={16} /> العودة للموقع</button>
        <div style={{ background: "#0e2944", border: "1px solid #1d3954", borderRadius: "22px", padding: "40px", boxShadow: "0 30px 80px rgba(0,0,0,.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "26px" }}>
            <span style={{ width: 52, height: 52, borderRadius: "15px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", color: "var(--navy-900)" }}><Icon name="shield" size={26} /></span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "19px" }}>لوحة تحكم الإدارة</div>
              <div style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>منصة الأستاذ محمد حجاج</div>
            </div>
          </div>
          <form onSubmit={submit}>
            <AInput label="اسم المستخدم" autoFocus value={f.user} onChange={e => setF({ ...f, user: e.target.value })} placeholder="admin" />
            <AInput label="كلمة المرور" type={show ? "text" : "password"} value={f.pass} onChange={e => setF({ ...f, pass: e.target.value })} placeholder="••••••••"
              after={<button type="button" onClick={() => setShow(s => !s)} title={show ? "إخفاء" : "إظهار"} style={{ color: "#7f909f", display: "grid", placeItems: "center" }}><Icon name={show ? "eyeOff" : "eye"} size={18} /></button>} />
            {err && <div style={{ color: "#e88a76", fontSize: "13.5px", fontWeight: 600, marginBottom: "12px" }}>{err}</div>}
            <ABtn type="submit" full icon="logout">دخول لوحة التحكم</ABtn>
          </form>
          <div style={{ marginTop: "20px", padding: "13px 16px", background: "#0c2235", borderRadius: "11px", fontSize: "12.5px", color: "#7f909f", lineHeight: 1.7 }}>
            بيانات تجريبية للدخول: <span style={{ color: "var(--gold-400)", fontWeight: 700, fontFamily: "ui-monospace,monospace" }}>admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- هيكل اللوحة (سايدبار) ----
function AdminShell({ ctx, active, setTab, children }) {
  const items = [
    { id: "overview", label: "نظرة عامة", icon: "grid" },
    { id: "cats", label: "الأقسام والمستويات", icon: "layers" },
    { id: "videos", label: "الفيديوهات والدروس", icon: "play" },
    { id: "content", label: "المحتوى العام", icon: "book" },
    { id: "testi", label: "التقييمات", icon: "star" },
    { id: "students", label: "الطلاب", icon: "user" },
    { id: "payments", label: "المدفوعات", icon: "card" },
  ];
  const [openM, setOpenM] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "#0a1f36", direction: "rtl", display: "flex" }}>
      {/* سايدبار */}
      <aside className="admin-side" style={{ width: "260px", flexShrink: 0, background: "#0c2235", borderInlineEnd: "1px solid #1d3954", padding: "22px 16px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "11px", padding: "6px 8px 22px", borderBottom: "1px solid #1d3954", marginBottom: "16px" }}>
          <span style={{ width: 42, height: 42, borderRadius: "12px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", color: "var(--navy-900)" }}><Icon name="shield" size={22} /></span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>لوحة الإدارة</div>
            <div style={{ color: "#7f909f", fontSize: "11.5px" }}>الأستاذ محمد حجاج</div>
          </div>
        </div>
        {items.map(it => (
          <button key={it.id} onClick={() => setTab(it.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", borderRadius: "11px", marginBottom: "3px", textAlign: "right", fontSize: "14.5px", fontWeight: 700, transition: "all .18s", color: active === it.id ? "#fff" : "#9fb0bf", background: active === it.id ? "linear-gradient(90deg,rgba(191,145,64,.18),transparent)" : "transparent", boxShadow: active === it.id ? "inset 2px 0 0 var(--gold)" : "none" }}>
            <Icon name={it.icon} size={19} style={{ color: active === it.id ? "var(--gold-400)" : "#7f909f" }} /> {it.label}
          </button>
        ))}
        <div style={{ borderTop: "1px solid #1d3954", marginTop: "16px", paddingTop: "16px" }}>
          <button onClick={() => ctx.nav("home")} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#9fb0bf" }}><Icon name="globe" size={18} /> عرض الموقع</button>
          <button onClick={() => { if (confirmDel("إعادة ضبط كل البيانات للوضع الافتراضي؟")) { Store.reset(); ctx.bumpDB(); } }} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#9fb0bf" }}><Icon name="layers" size={18} /> إعادة الضبط</button>
          <button onClick={ctx.adminLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px", borderRadius: "11px", textAlign: "right", fontSize: "14px", fontWeight: 700, color: "#e88a76" }}><Icon name="logout" size={18} /> خروج</button>
        </div>
      </aside>

      {/* المحتوى */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div className="admin-topbar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#0c2235", borderBottom: "1px solid #1d3954", position: "sticky", top: 0, zIndex: 40 }}>
          <button onClick={() => setOpenM(o => !o)} style={{ color: "#fff" }}><Icon name="menu" size={24} /></button>
          <span style={{ color: "#fff", fontWeight: 800 }}>لوحة الإدارة</span>
        </div>
        {openM && (
          <div className="admin-mobile-nav" style={{ display: "none", background: "#0c2235", borderBottom: "1px solid #1d3954", padding: "10px" }}>
            {items.map(it => <button key={it.id} onClick={() => { setTab(it.id); setOpenM(false); }} style={{ display: "block", width: "100%", textAlign: "right", padding: "12px", color: active === it.id ? "var(--gold-400)" : "#cdd7e0", fontWeight: 700 }}>{it.label}</button>)}
          </div>
        )}
        <div style={{ padding: "32px", maxWidth: "1100px" }} className="admin-content">{children}</div>
      </div>
    </div>
  );
}

function AdminHead({ title, sub, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "26px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "27px", marginBottom: "5px" }}>{title}</h1>
        {sub && <p style={{ color: "#7f909f", fontSize: "14.5px" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

Object.assign(window, { AdminLoginPage, AdminShell, AdminHead, AInput, AArea, ASelect, AToggle, ABtn, AModal, ACard, confirmDel });
