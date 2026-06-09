// ============ طبقة البيانات + إدارة الأدمن ============
const DB_KEY = "mh_admin_db";
const DB_VERSION = 3;
// بيانات دخول الأدمن التجريبية
const ADMIN_CREDS = { user: "admin", pass: "admin123" };

// عيّنات لوحة الأدمن
const SAMPLE_STUDENTS = [
  { id: "s1", name: "عبدالله محمد", email: "abdullah@mail.com", plan: "الاشتراك الشهري", joined: "٢٠٢٦/٠٥/١٢", status: "نشط" },
  { id: "s2", name: "سارة المنصوري", email: "sara@mail.com", plan: "حزمة كاملة", joined: "٢٠٢٦/٠٤/٠٨", status: "نشط" },
  { id: "s3", name: "أم يوسف", email: "umyousef@mail.com", plan: "دورة واحدة", joined: "٢٠٢٦/٠٥/٢٨", status: "نشط" },
  { id: "s4", name: "Daniel Roberts", email: "daniel@mail.com", plan: "الاشتراك الشهري", joined: "٢٠٢٦/٠٣/١٩", status: "نشط" },
  { id: "s5", name: "خالد إبراهيم", email: "khaled@mail.com", plan: "دورة واحدة", joined: "٢٠٢٦/٠٢/١١", status: "متوقف" },
];
const SAMPLE_PAYMENTS = [
  { id: "p1", student: "عبدالله محمد", plan: "الاشتراك الشهري", amount: 89, cur: "د.إ", date: "٢٠٢٦/٠٦/٠١", status: "ناجح" },
  { id: "p2", student: "سارة المنصوري", plan: "حزمة كاملة", amount: 899, cur: "د.إ", date: "٢٠٢٦/٠٥/٢٨", status: "ناجح" },
  { id: "p3", student: "أم يوسف", plan: "دورة واحدة", amount: 1990, cur: "ج.م", date: "٢٠٢٦/٠٥/٢٨", status: "ناجح" },
  { id: "p4", student: "Daniel Roberts", plan: "الاشتراك الشهري", amount: 24, cur: "$", date: "٢٠٢٦/٠٥/١٩", status: "ناجح" },
  { id: "p5", student: "خالد إبراهيم", plan: "دورة واحدة", amount: 149, cur: "د.إ", date: "٢٠٢٦/٠٤/١١", status: "مسترد" },
];

function defaultDB() {
  return {
    v: DB_VERSION,
    cats: JSON.parse(JSON.stringify(CATEGORIES)),
    instructor: JSON.parse(JSON.stringify(INSTRUCTOR)),
    plans: JSON.parse(JSON.stringify(PLANS)),
    hero: { title: "تعلّم العربية والقرآن مع معلّمٍ أزهري بخبرة منظّمة", sub: "تأسيس، ومناهج إماراتية ومصرية وأزهرية، وعربية لغير الناطقين بها، وتعليم القرآن الكريم — نبني المهارة لبنةً لبنة." },
    testimonials: JSON.parse(JSON.stringify(TESTIMONIALS)),
    lessons: {},
    students: SAMPLE_STUDENTS,
    payments: SAMPLE_PAYMENTS,
  };
}

function loadDB() {
  try {
    const d = JSON.parse(localStorage.getItem(DB_KEY));
    if (d && d.cats) {
      // ترقية النسخ المخزّنة القديمة دون المساس بتعديلات الأدمن الأخرى
      if (d.v !== DB_VERSION) {
        const def = defaultDB();
        if (!d.v) { // ما قبل v2: تحديث نصوص الهيرو والإحصاءات الافتراضية
          d.hero = def.hero;
          if (d.instructor) d.instructor.stats = def.instructor.stats;
        }
        if (!d.testimonials) d.testimonials = def.testimonials; // v3: التقييمات
        d.v = DB_VERSION;
        persistDB(d);
      }
      return d;
    }
  } catch {}
  return defaultDB();
}
function persistDB(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {} }

// تطبيق البيانات على الكائنات الحيّة التي تقرأها الصفحات العامة
function applyDB(db) {
  if (db.cats) { CATEGORIES.length = 0; db.cats.forEach(c => CATEGORIES.push(c)); }
  if (db.instructor) {
    Object.keys(INSTRUCTOR).forEach(k => { delete INSTRUCTOR[k]; });
    Object.assign(INSTRUCTOR, db.instructor);
  }
  if (db.plans) { PLANS.length = 0; db.plans.forEach(p => PLANS.push(p)); }
  if (db.testimonials) { TESTIMONIALS.length = 0; db.testimonials.forEach(t => TESTIMONIALS.push(t)); }
  window.__lessonsOverride = db.lessons || {};
}

// مفتاح الساب-كاتيجوري كما تستخدمه صفحة الكاتيجوري
function subKey(group, sub) {
  return (group && group.id !== "main" ? group.id + "-" : "") + sub.id;
}
function lessonsKey(catId, group, sub) { return catId + "|" + subKey(group, sub); }

// إرجاع دروس ساب-كاتيجوري (تجاوز الأدمن أو المولّدة)
function lessonsOf(cat, group, sub) {
  return genLessons(cat.id, subKey(group, sub), sub.title);
}

// تهيئة عند التحميل
let __DB = loadDB();
applyDB(__DB);

const Store = {
  get: () => __DB,
  set: (db) => { __DB = db; persistDB(db); applyDB(db); },
  reset: () => { __DB = defaultDB(); persistDB(__DB); applyDB(__DB); },
};

Object.assign(window, { Store, ADMIN_CREDS, subKey, lessonsKey, lessonsOf, defaultDB });
