"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { Btn, Field, Icon, type IconName } from "@/components/ui";
import { ApiError, apiPost } from "@/lib/client";
import {
  arNum,
  CURRENCIES,
  type CategoryListItem,
  type Order,
  type Plan,
} from "@/lib/types";

type Currency = (typeof CURRENCIES)[number];
type Method = "card" | "wallet" | "bank";
type Stage = "form" | "processing" | "done";

const METHODS: { id: Method; label: string; ic: IconName }[] = [
  { id: "card", label: "بطاقة بنكية", ic: "card" },
  { id: "wallet", label: "محفظة إلكترونية", ic: "phone" },
  { id: "bank", label: "تحويل بنكي", ic: "shield" },
];

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** صفحة الدفع (Checkout) — منقولة بأمانة من النموذج الأولي */
export function CheckoutClient({
  plans,
  categories,
  planKey,
  catId,
}: {
  plans: Plan[];
  categories: CategoryListItem[];
  planKey: string | null;
  catId: string | null;
}) {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const plan: Plan | undefined =
    plans.find((p) => p.key === planKey) ?? plans[0];
  const cat: CategoryListItem | null =
    (catId ? categories.find((c) => c.id === catId) : null) ?? null;

  const [cur, setCur] = useState<Currency>(CURRENCIES[0]);
  const [method, setMethod] = useState<Method>("card");
  const [card, setCard] = useState({ num: "", name: "", exp: "", cvc: "" });
  const [stage, setStage] = useState<Stage>("form");
  const [payError, setPayError] = useState<string | null>(null);

  // جارٍ التحقق من الجلسة
  if (loading) {
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );
  }

  // لا توجد باقات — لا يمكن إتمام الدفع
  if (!plan) {
    return (
      <div className="wrap" style={{ padding: "80px 24px", textAlign: "center", maxWidth: "520px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", margin: "0 auto 24px" }}><Icon name="card" size={36} /></div>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>لا توجد باقات متاحة حالياً</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>يرجى المحاولة لاحقاً.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Btn variant="primary" size="lg" onClick={() => router.push("/pricing")}>رجوع للباقات</Btn>
        </div>
      </div>
    );
  }

  const price = plan.prices[cur.code];

  if (!user) {
    return (
      <div className="wrap" style={{ padding: "80px 24px", textAlign: "center", maxWidth: "520px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", margin: "0 auto 24px" }}><Icon name="user" size={36} /></div>
        <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>سجّل الدخول لإتمام الدفع</h1>
        <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "28px" }}>تحتاج إلى حساب لإتمام عملية الشراء وفتح الكورسات.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Btn variant="gold" size="lg" onClick={() => router.push("/register")}>أنشئ حساباً</Btn>
          <Btn variant="outline" size="lg" onClick={() => router.push("/login")}>تسجيل الدخول</Btn>
        </div>
      </div>
    );
  }

  const pay = async () => {
    if (stage === "processing") return;
    setPayError(null);
    setStage("processing");
    try {
      const order = await apiPost<Order>("/orders", {
        planKey: plan.key,
        categoryId: cat?.id,
        currency: cur.code,
        provider: "paymob",
      });
      await sleep(1900);
      await apiPost<Order>(`/orders/${order.id}/pay`);
      await refresh();
      setStage("done");
    } catch (e) {
      setPayError(e instanceof ApiError ? e.message : "حدث خطأ غير متوقع");
      setStage("form");
    }
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
            <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => router.push(cat ? `/courses/${cat.slug}` : "/courses")}>ابدأ المشاهدة</Btn>
            <Btn variant="outline" size="lg" icon="grid" onClick={() => router.push("/dashboard")}>لوحة الطالب</Btn>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)" }}>
      <div className="wrap" style={{ padding: "40px 24px 80px" }}>
        <Link href="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--muted)", fontSize: "14px", fontWeight: 700, marginBottom: "24px" }}><Icon name="chevR" size={16} /> رجوع للباقات</Link>
        <div className="checkout-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "32px", alignItems: "start" }}>
          {/* نموذج الدفع */}
          <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "34px", boxShadow: "var(--shadow-sm)" }}>
            <h1 style={{ fontSize: "26px", marginBottom: "6px" }}>إتمام الدفع</h1>
            <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "26px" }}>أكمل بياناتك لإتمام الاشتراك بأمان.</p>

            {payError && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(180,69,47,.07)", border: "1px solid var(--danger)", borderRadius: "12px", padding: "13px 16px", marginBottom: "22px", color: "var(--danger)", fontSize: "14px", fontWeight: 700, lineHeight: 1.6 }}>
                <Icon name="x" size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
                {payError}
              </div>
            )}

            {/* العملة */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>العملة</div>
              <div style={{ display: "flex", gap: "8px" }}>
                {CURRENCIES.map((c) => (
                  <button key={c.code} onClick={() => setCur(c)} style={{ padding: "10px 18px", borderRadius: "10px", fontSize: "14px", fontWeight: 700, background: cur.code === c.code ? "var(--navy-800)" : "var(--cream-2)", color: cur.code === c.code ? "#fff" : "var(--ink-2)" }}>{c.name}</button>
                ))}
              </div>
            </div>

            {/* طريقة الدفع */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "10px" }}>طريقة الدفع</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                {METHODS.map(({ id, label, ic }) => (
                  <button key={id} onClick={() => setMethod(id)} style={{ padding: "16px 12px", borderRadius: "12px", border: `1.6px solid ${method === id ? "var(--gold)" : "var(--line)"}`, background: method === id ? "var(--gold-100)" : "var(--cream)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", transition: "all .2s" }}>
                    <Icon name={ic} size={22} style={{ color: method === id ? "var(--gold-700)" : "var(--muted)" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: method === id ? "var(--navy-900)" : "var(--ink-2)" }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {method === "card" && (
              <form onSubmit={(e) => { e.preventDefault(); void pay(); }}>
                <Field label="رقم البطاقة" icon="card" value={card.num} onChange={(e) => setCard({ ...card, num: e.target.value })} placeholder="٤٢٤٢ ٤٢٤٢ ٤٢٤٢ ٤٢٤٢" />
                <Field label="الاسم على البطاقة" icon="user" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="MOHAMMED HAGGAG" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <Field label="تاريخ الانتهاء" value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} placeholder="MM / YY" />
                  <Field label="CVC" type="password" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} placeholder="•••" />
                </div>
                <Btn variant="gold" size="lg" full type="submit" icon="lock" style={{ marginTop: "8px" }}>ادفع {arNum(price)} {cur.label} بأمان</Btn>
              </form>
            )}
            {method !== "card" && (
              <div style={{ textAlign: "center", padding: "30px 20px", background: "var(--cream)", borderRadius: "var(--r)", border: "1px dashed var(--line)" }}>
                <Icon name={method === "wallet" ? "phone" : "shield"} size={40} style={{ color: "var(--gold)", margin: "0 auto 14px" }} />
                <p style={{ color: "var(--ink-2)", fontSize: "15px", marginBottom: "20px" }}>{method === "wallet" ? "سيتم تحويلك إلى المحفظة الإلكترونية لإتمام الدفع." : "ستظهر تفاصيل الحساب البنكي لإتمام التحويل."}</p>
                <Btn variant="gold" size="lg" full icon="lock" onClick={() => void pay()}>متابعة الدفع</Btn>
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
              <div style={{ display: "flex", justifyContent: "space-between", color: "var(--ink-2)" }}><span>{cat ? "وصول كامل للمسار" : plan.period}</span><span>{arNum(price)} {cur.label}</span></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "18px", borderTop: "2px solid var(--line)" }}>
              <span style={{ fontWeight: 800, fontSize: "17px", color: "var(--navy-900)" }}>الإجمالي</span>
              <span style={{ fontWeight: 900, fontSize: "26px", color: "var(--navy-900)" }}>{arNum(price)} <span style={{ fontSize: "16px", color: "var(--gold-700)" }}>{cur.label}</span></span>
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
