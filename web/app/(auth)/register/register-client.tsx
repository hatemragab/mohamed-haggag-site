"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Btn, Field } from "@/components/ui";
import { useAuth } from "@/components/auth-context";
import { ApiError } from "@/lib/client";
import AuthShell from "../auth-shell";

interface FormState {
  name: string;
  email: string;
  pass: string;
  phone: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  pass?: string;
}

/* تسجيل حساب جديد — منقول من النموذج الأولي */
export default function RegisterClient() {
  const { register } = useAuth();
  const router = useRouter();
  const [f, setF] = useState<FormState>({ name: "", email: "", pass: "", phone: "" });
  const [err, setErr] = useState<FieldErrors>({});
  const [general, setGeneral] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const er: FieldErrors = {};
    if (f.name.trim().length < 3) er.name = "يرجى إدخال الاسم كاملاً";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "بريد إلكتروني غير صحيح";
    if (f.pass.length < 6) er.pass = "كلمة المرور ٦ أحرف على الأقل";
    setErr(er);
    setGeneral("");
    if (Object.keys(er).length > 0) return;
    setBusy(true);
    try {
      await register({
        name: f.name.trim(),
        email: f.email.trim(),
        password: f.pass,
        phone: f.phone.trim() ? f.phone.trim() : undefined,
      });
      router.push("/dashboard");
    } catch (ex) {
      if (ex instanceof ApiError) {
        // بريد مستخدم من قبل → أظهر الرسالة أسفل حقل البريد
        if (ex.status === 409) setErr({ email: ex.message });
        else setGeneral(ex.message);
      } else {
        setGeneral("تعذّر الاتصال بالخادم، حاول مرة أخرى");
      }
      setBusy(false);
    }
  };

  return (
    <AuthShell mode="register">
      <Badge tone="gold" style={{ marginBottom: "18px" }}>حساب جديد · مجاناً</Badge>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>أنشئ حسابك الآن</h1>
      <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "30px" }}>أنشئ حسابك في أقل من دقيقة وابدأ بمعاينة الدروس التجريبية مجاناً.</p>
      <form onSubmit={submit}>
        <Field label="الاسم الكامل" icon="user" value={f.name} onChange={set("name")} placeholder="مثال: عبدالله محمد" error={err.name} />
        <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={set("email")} placeholder="you@example.com" error={err.email} />
        <Field label="رقم الهاتف (اختياري)" icon="phone" value={f.phone} onChange={set("phone")} placeholder="+971 5X XXX XXXX" />
        <Field label="كلمة المرور" type="password" icon="lock" value={f.pass} onChange={set("pass")} placeholder="••••••••" error={err.pass} hint="٦ أحرف على الأقل" />
        {general && (
          <p role="alert" style={{ fontSize: "14px", color: "var(--danger)", fontWeight: 700, marginBottom: "18px", lineHeight: 1.7 }}>{general}</p>
        )}
        <Btn variant="gold" size="lg" full type="submit" iconAfter="arrow" disabled={busy}>
          {busy ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
        </Btn>
      </form>
      <div style={{ textAlign: "center", marginTop: "22px", fontSize: "14.5px", color: "var(--ink-2)" }}>
        لديك حساب بالفعل؟ <Link href="/login" style={{ color: "var(--gold-700)", fontWeight: 800 }}>سجّل الدخول</Link>
      </div>
      <p style={{ textAlign: "center", marginTop: "16px", fontSize: "12.5px", color: "var(--muted)", lineHeight: 1.7 }}>بإنشائك حساباً فأنت توافق على <Link href="/terms" style={{ color: "var(--navy-700)", fontWeight: 700, textDecoration: "underline" }}>الشروط وسياسة الخصوصية</Link></p>
    </AuthShell>
  );
}
