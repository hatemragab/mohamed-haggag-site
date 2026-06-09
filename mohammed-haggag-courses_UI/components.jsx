// ============ مكوّنات مشتركة ============
const { useState, useEffect, useRef } = React;

// أيقونات خطّية بسيطة
function Icon({ name, size = 20, stroke = 1.8, style }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", style };
  const paths = {
    play: <polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" />,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
    unlock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7.5-2" /></>,
    check: <polyline points="20 6 9 17 4 12" />,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    arrow: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    arrowL: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 14" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>,
    layers: <><polygon points="12 2 22 8.5 12 15 2 8.5 12 2" /><polyline points="2 15.5 12 22 22 15.5" /></>,
    chevD: <polyline points="6 9 12 15 18 9" />,
    chevL: <polyline points="15 6 9 12 15 18" />,
    chevR: <polyline points="9 6 15 12 9 18" />,
    star: <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 21.5 12 17.8 5.5 21.5 7 14.5 2 9.5 9 9" fill="currentColor" stroke="none" />,
    menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    shield: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
    card: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    chart: <><line x1="4" y1="20" x2="20" y2="20" /><rect x="6" y="12" width="3" height="6" /><rect x="11" y="8" width="3" height="10" /><rect x="16" y="4" width="3" height="14" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><polyline points="3 7 12 13 21 7" /></>,
    phone: <path d="M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
    whatsapp: <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z" />,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    cap: <><path d="M22 9 12 4 2 9l10 5 10-5z" /><path d="M6 11v5c0 1 3 2.5 6 2.5s6-1.5 6-2.5v-5" /></>,
    sparkle: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" fill="currentColor" stroke="none" />,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 5.1A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.1M6.6 6.6C3.8 8.5 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.3-1" /></>,
    up: <polyline points="6 14 12 8 18 14" />,
    down: <polyline points="6 10 12 16 18 10" />,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

// زر
function Btn({ children, variant = "primary", size = "md", icon, iconAfter, onClick, full, type = "button", style }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px",
    fontWeight: 700, fontFamily: "var(--font)", borderRadius: "999px", cursor: "pointer",
    transition: "all .2s cubic-bezier(.2,.7,.2,1)", whiteSpace: "nowrap",
    width: full ? "100%" : "auto", letterSpacing: ".01em",
  };
  const sizes = {
    sm: { padding: "9px 18px", fontSize: "14px" },
    md: { padding: "13px 26px", fontSize: "15.5px" },
    lg: { padding: "17px 36px", fontSize: "17px" },
  };
  const variants = {
    primary: { background: "linear-gradient(180deg,var(--navy-700),var(--navy-900))", color: "#fff", boxShadow: "0 4px 14px rgba(14,41,68,.28)" },
    gold: { background: "linear-gradient(180deg,var(--gold-400),var(--gold))", color: "var(--navy-900)", boxShadow: "0 4px 14px rgba(191,145,64,.35)" },
    outline: { background: "transparent", color: "var(--navy-800)", boxShadow: "inset 0 0 0 1.6px var(--navy-800)" },
    ghost: { background: "var(--cream-2)", color: "var(--navy-800)" },
    soft: { background: "var(--gold-100)", color: "var(--gold-700)" },
    white: { background: "#fff", color: "var(--navy-900)", boxShadow: "var(--shadow-sm)" },
  };
  const [h, setH] = useState(false);
  const hover = h ? { transform: "translateY(-2px)", filter: "brightness(1.04)", boxShadow: variant === "gold" ? "0 8px 22px rgba(191,145,64,.45)" : "0 8px 22px rgba(14,41,68,.32)" } : {};
  return (
    <button type={type} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...hover, ...style }}>
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 18} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === "lg" ? 20 : 18} />}
    </button>
  );
}

// شارة
function Badge({ children, tone = "navy", style }) {
  const tones = {
    navy: { background: "var(--navy-800)", color: "#fff" },
    gold: { background: "var(--gold-100)", color: "var(--gold-700)" },
    green: { background: "#e4efe9", color: "var(--green)" },
    muted: { background: "var(--cream-2)", color: "var(--ink-2)" },
    line: { background: "transparent", color: "var(--ink-2)", boxShadow: "inset 0 0 0 1px var(--line)" },
  };
  return <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 700, padding: "5px 12px", borderRadius: "999px", ...tones[tone], ...style }}>{children}</span>;
}

// عدّاد متحرّك — يبدأ عند ظهوره على الشاشة
function Counter({ value, suffix = "", dur = 1600 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let raf, started = false;
    const run = () => {
      if (started) return; started = true;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { run(); return () => cancelAnimationFrame(raf); }
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { run(); io.disconnect(); }
    }, { threshold: .4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{n.toLocaleString("ar-EG")}{suffix}</span>;
}

// زخرفة هندسية إسلامية بسيطة (SVG نمطي)
function Ornament({ size = 60, color = "var(--gold)", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3">
        <path d="M30 6 L54 30 L30 54 L6 30 Z" />
        <path d="M30 16 L44 30 L30 44 L16 30 Z" />
        <circle cx="30" cy="30" r="5" />
        <line x1="30" y1="6" x2="30" y2="54" /><line x1="6" y1="30" x2="54" y2="30" />
      </g>
    </svg>
  );
}

// رأس الصفحة
function Header({ ctx }) {
  const { nav, page, user, logout } = ctx;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", f); f();
    return () => window.removeEventListener("scroll", f);
  }, []);
  const links = [
    { id: "home", label: "الرئيسية" },
    { id: "courses", label: "الكورسات" },
    { id: "pricing", label: "الباقات والأسعار" },
    { id: "about", label: "عن الأستاذ" },
    { id: "faq", label: "الأسئلة الشائعة" },
    { id: "contact", label: "تواصل معنا" },
  ];
  const go = (id) => { nav(id); setOpen(false); };
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(250,246,238,.88)" : "rgba(250,246,238,0)",
      backdropFilter: scrolled ? "saturate(160%) blur(14px)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "all .3s ease",
    }}>
      <div className="wrap" style={{ display: "flex", alignItems: "center", gap: "20px", height: "76px" }}>
        <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ width: "44px", height: "44px", borderRadius: "13px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden" }}>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "24px", fontWeight: 700, lineHeight: 1 }}>م</span>
          </span>
          <span style={{ textAlign: "right", lineHeight: 1.2 }}>
            <span style={{ display: "block", fontWeight: 800, fontSize: "16px", color: "var(--navy-900)" }}>الأستاذ محمد حجاج</span>
            <span style={{ display: "block", fontSize: "11.5px", color: "var(--gold-700)", fontWeight: 700 }}>منصة تعليمية أزهرية</span>
          </span>
        </button>

        <nav style={{ display: "flex", gap: "4px", marginInlineStart: "auto" }} className="desk-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)}
              style={{ padding: "9px 15px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
                color: page === l.id ? "var(--navy-900)" : "var(--ink-2)",
                background: page === l.id ? "var(--gold-100)" : "transparent", transition: "all .2s" }}>
              {l.label}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="desk-cta">
          {user ? (
            <>
              <Btn variant="ghost" size="sm" icon="grid" onClick={() => go("dashboard")}>لوحتي</Btn>
              <button onClick={logout} title="خروج" style={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: "10px", background: "var(--cream-2)", color: "var(--ink-2)" }}><Icon name="logout" size={18} /></button>
            </>
          ) : (
            <>
              <Btn variant="ghost" size="sm" onClick={() => go("login")}>دخول</Btn>
              <Btn variant="gold" size="sm" onClick={() => go("register")}>أنشئ حسابك</Btn>
            </>
          )}
        </div>

        <button className="burger" onClick={() => setOpen(o => !o)} style={{ display: "none", width: 42, height: 42, placeItems: "center", borderRadius: "10px", background: "var(--cream-2)", color: "var(--navy-900)" }}>
          <Icon name={open ? "x" : "menu"} size={22} />
        </button>
      </div>

      {open && (
        <div className="mobile-menu" style={{ background: "var(--paper)", borderTop: "1px solid var(--line)", padding: "16px 24px 24px", boxShadow: "var(--shadow)" }}>
          {links.map(l => (
            <button key={l.id} onClick={() => go(l.id)} style={{ display: "block", width: "100%", textAlign: "right", padding: "13px 8px", borderBottom: "1px solid var(--line-2)", fontSize: "16px", fontWeight: 700, color: page === l.id ? "var(--gold-700)" : "var(--ink)" }}>{l.label}</button>
          ))}
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            {user ? (
              <Btn variant="primary" full onClick={() => go("dashboard")}>لوحة الطالب</Btn>
            ) : (
              <>
                <Btn variant="outline" full onClick={() => go("login")}>دخول</Btn>
                <Btn variant="gold" full onClick={() => go("register")}>حساب جديد</Btn>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

// تذييل
function Footer({ ctx }) {
  const { nav } = ctx;
  const cols = [
    { title: "المنصة", links: [["home", "الرئيسية"], ["courses", "الكورسات"], ["pricing", "الباقات والأسعار"], ["about", "عن الأستاذ"]] },
    { title: "المساعدة", links: [["faq", "الأسئلة الشائعة"], ["contact", "تواصل معنا"], ["terms", "الشروط والخصوصية"]] },
    { title: "الحساب", links: [["register", "إنشاء حساب"], ["login", "تسجيل الدخول"], ["dashboard", "لوحة الطالب"]] },
  ];
  return (
    <footer style={{ background: "var(--navy-900)", color: "#cdd7e0", paddingTop: "72px" }}>
      <div className="wrap foot-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: "40px", paddingBottom: "56px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
            <span style={{ width: "46px", height: "46px", borderRadius: "13px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center" }}>
              <span className="serif" style={{ color: "var(--navy-900)", fontSize: "25px", fontWeight: 700 }}>م</span>
            </span>
            <div>
              <div style={{ fontWeight: 800, fontSize: "17px", color: "#fff" }}>الأستاذ محمد حجاج</div>
              <div style={{ fontSize: "12px", color: "var(--gold-400)" }}>منصة تعليمية أزهرية</div>
            </div>
          </div>
          <p style={{ fontSize: "14.5px", lineHeight: 1.9, maxWidth: "320px", color: "#9fb0bf" }}>
            منصة تعليمية متخصصة في اللغة العربية والعلوم الشرعية وتعليم القرآن الكريم، بإشراف معلّم أزهري موثوق.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <div style={{ fontWeight: 800, color: "#fff", marginBottom: "16px", fontSize: "15px" }}>{c.title}</div>
            {c.links.map(([id, label]) => (
              <button key={id} onClick={() => nav(id)} style={{ display: "block", color: "#9fb0bf", fontSize: "14.5px", padding: "7px 0", transition: "color .2s", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--gold-400)"} onMouseLeave={e => e.currentTarget.style.color = "#9fb0bf"}>{label}</button>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.1)" }}>
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", padding: "22px 24px", fontSize: "13.5px", color: "#7f909f" }}>
          <span>© {new Date().getFullYear()} منصة الأستاذ محمد حجاج التعليمية — جميع الحقوق محفوظة.</span>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <button onClick={() => nav("adminLogin")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#7f909f", fontWeight: 700, transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--gold-400)"} onMouseLeave={e => e.currentTarget.style.color = "#7f909f"}>
              <Icon name="shield" size={15} /> دخول الإدارة
            </button>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "17px" }}>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// بطاقة دورة/كاتيجوري
function CategoryCard({ cat, ctx, idx }) {
  const { nav } = ctx;
  const [h, setH] = useState(false);
  const subCount = cat.groups ? cat.groups.reduce((a, g) => a + g.subs.length, 0) : cat.subs.length;
  return (
    <button onClick={() => nav("category", { catId: cat.id })} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="reveal"
      style={{ textAlign: "right", background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "28px", border: "1px solid var(--line)", boxShadow: h ? "var(--shadow-lg)" : "var(--shadow-sm)", transform: h ? "translateY(-4px)" : "none", transition: "all .28s cubic-bezier(.2,.7,.2,1)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: `${idx * 60}ms` }}>
      <div style={{ position: "absolute", top: -20, left: -20, width: 120, height: 120, background: "radial-gradient(circle, var(--gold-100), transparent 70%)", opacity: h ? 1 : .5, transition: "opacity .3s" }} />
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "18px", position: "relative" }}>
        <span style={{ width: "62px", height: "62px", borderRadius: "18px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", display: "grid", placeItems: "center", boxShadow: "var(--shadow-sm)", flexShrink: 0 }}>
          <span className="serif" style={{ color: "var(--gold-400)", fontSize: "30px", fontWeight: 700 }}>{cat.glyph}</span>
        </span>
        <Badge tone="gold">{cat.level}</Badge>
      </div>
      <h3 style={{ fontSize: "20px", marginBottom: "6px", position: "relative" }}>{cat.title}</h3>
      <div style={{ color: "var(--gold-700)", fontSize: "13.5px", fontWeight: 700, marginBottom: "12px" }}>{cat.tagline}</div>
      <p style={{ color: "var(--ink-2)", fontSize: "14.5px", lineHeight: 1.75, flexGrow: 1 }}>{cat.desc}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "20px", paddingTop: "18px", borderTop: "1px solid var(--line-2)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontSize: "13.5px", color: "var(--muted)", fontWeight: 700 }}>
          <Icon name="layers" size={16} /> {subCount.toLocaleString("ar-EG")} مستوى
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--navy-700)", fontWeight: 800, fontSize: "14px", transform: h ? "translateX(-4px)" : "none", transition: "transform .25s" }}>
          استعرض <Icon name="arrow" size={17} />
        </span>
      </div>
    </button>
  );
}

Object.assign(window, { Icon, Btn, Badge, Counter, Ornament, Header, Footer, CategoryCard });
