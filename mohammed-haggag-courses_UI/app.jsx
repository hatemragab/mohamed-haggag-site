// ============ الراوتر + الحالة العامة ============
function App() {
  const [route, setRoute] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem("mh_route")); return s || { page: "home", params: {} }; } catch { return { page: "home", params: {} }; }
  });
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("mh_user")) || null; } catch { return null; } });
  const [unlocked, setUnlocked] = useState(() => { try { return JSON.parse(localStorage.getItem("mh_unlocked")) || []; } catch { return []; } });
  const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem("mh_progress")) || {}; } catch { return {}; } });
  const [continueList, setContinueList] = useState(() => { try { return JSON.parse(localStorage.getItem("mh_continue")) || []; } catch { return []; } });
  const [adminUser, setAdminUser] = useState(() => { try { return JSON.parse(localStorage.getItem("mh_admin_user")) || null; } catch { return null; } });
  const [dbV, setDbV] = useState(0); // نسخة البيانات لإعادة الرسم بعد تعديلات الأدمن

  // ثبات في localStorage (نتجاهل params الثقيلة مثل lesson لتفادي مشاكل التسلسل)
  useEffect(() => { localStorage.setItem("mh_route", JSON.stringify({ page: route.page, params: route.params.catId ? { catId: route.params.catId } : {} })); }, [route]);
  useEffect(() => { localStorage.setItem("mh_user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("mh_unlocked", JSON.stringify(unlocked)); }, [unlocked]);
  useEffect(() => { localStorage.setItem("mh_progress", JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem("mh_continue", JSON.stringify(continueList)); }, [continueList]);
  useEffect(() => { localStorage.setItem("mh_admin_user", JSON.stringify(adminUser)); }, [adminUser]);

  const nav = (page, params = {}) => { setRoute({ page, params }); window.scrollTo({ top: 0, behavior: "instant" }); };

  const login = (name, email) => { setUser({ name: name || "طالب", email }); nav("dashboard"); };
  const logout = () => { setUser(null); nav("home"); };

  const isUnlocked = (catId) => unlocked === "all" || (Array.isArray(unlocked) && unlocked.includes(catId));

  const openCheckout = (planId, catId) => {
    if (!user) { nav("register"); return; }
    nav("checkout", { planId, catId });
  };
  const completePurchase = (planId, catId) => {
    if (planId === "monthly" || planId === "bundle") setUnlocked("all");
    else if (catId) setUnlocked(prev => (prev === "all" ? "all" : Array.from(new Set([...(prev || []), catId]))));
    else setUnlocked(prev => (prev === "all" ? "all" : Array.from(new Set([...(prev || []), CATEGORIES[0].id]))));
  };

  const adminLogin = () => { setAdminUser({ user: "admin", t: Date.now() }); nav("admin"); };
  const adminLogout = () => { setAdminUser(null); nav("home"); };
  const bumpDB = () => setDbV(v => v + 1);

  const isDone = (id) => !!progress[id];
  const toggleDone = (id) => setProgress(p => ({ ...p, [id]: !p[id] }));
  const addContinue = (item) => {
    setContinueList(prev => {
      const filtered = prev.filter(x => x.lesson.id !== item.lesson.id);
      return [{ catId: item.catId, lesson: item.lesson, subTitle: item.subTitle, t: Date.now() }, ...filtered].slice(0, 8);
    });
  };

  const ctx = { nav, page: route.page, params: route.params, user, login, logout, unlocked, isUnlocked, openCheckout, completePurchase, progress, isDone, toggleDone, continueList, addContinue, adminUser, adminLogin, adminLogout, bumpDB, dbV };

  // اختيار الصفحة
  let Page;
  switch (route.page) {
    case "home": Page = <HomePage ctx={ctx} />; break;
    case "courses": Page = <CoursesPage ctx={ctx} />; break;
    case "category": Page = <CategoryPage ctx={ctx} />; break;
    case "lesson": Page = route.params.lesson ? <LessonPage ctx={ctx} /> : <CategoryPage ctx={ctx} />; break;
    case "register": Page = <RegisterPage ctx={ctx} />; break;
    case "login": Page = <LoginPage ctx={ctx} />; break;
    case "pricing": Page = <PricingPage ctx={ctx} />; break;
    case "checkout": Page = <CheckoutPage ctx={ctx} />; break;
    case "dashboard": Page = <DashboardPage ctx={ctx} />; break;
    case "about": Page = <AboutPage ctx={ctx} />; break;
    case "faq": Page = <FaqPage ctx={ctx} />; break;
    case "contact": Page = <ContactPage ctx={ctx} />; break;
    case "terms": Page = <TermsPage ctx={ctx} />; break;
    case "adminLogin": Page = adminUser ? <AdminDashboard ctx={ctx} /> : <AdminLoginPage ctx={ctx} />; break;
    case "admin": Page = adminUser ? <AdminDashboard ctx={ctx} /> : <AdminLoginPage ctx={ctx} />; break;
    default: Page = <HomePage ctx={ctx} />;
  }

  // الصفحات التي تُخفي الهيدر/الفوتر (auth + admin)
  const bare = ["register", "login", "admin", "adminLogin"].includes(route.page);

  return (
    <div>
      {!bare && <Header ctx={ctx} />}
      <main data-screen-label={route.page} key={route.page + (route.params.catId || "") + (route.params.lesson?.id || "") + "-" + dbV} style={{ animation: "fadeIn .35s ease" }}>{Page}</main>
      {!bare && <Footer ctx={ctx} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
