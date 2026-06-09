"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Btn, Field } from "@/components/ui";
import { useAuth } from "@/components/auth-context";
import { ApiError } from "@/lib/client";
import AuthShell from "../auth-shell";

interface FieldErrors {
  email?: string;
  pass?: string;
}

/* تسجيل الدخول — منقول من النموذج الأولي */
export default function LoginClient() {
  const { login } = useAuth();
  const router = useRouter();
  const [f, setF] = useState({ email: "", pass: "" });
  const [err, setErr] = useState<FieldErrors>({});
  const [general, setGeneral] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const er: FieldErrors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = "بريد إلكتروني غير صحيح";
    if (f.pass.length < 1) er.pass = "أدخل كلمة المرور";
    setErr(er);
    setGeneral("");
    if (Object.keys(er).length > 0) return;
    setBusy(true);
    try {
      await login(f.email.trim(), f.pass);
      router.push("/dashboard");
    } catch (ex) {
      setGeneral(ex instanceof ApiError ? ex.message : "تعذّر الاتصال بالخادم، حاول مرة أخرى");
      setBusy(false);
    }
  };

  return (
    <AuthShell mode="login">
      <Badge tone="gold" style={{ marginBottom: "18px" }}>تسجيل الدخول</Badge>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>أهلاً بعودتك</h1>
      <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "30px" }}>سجّل الدخول لمتابعة دروسك من حيث توقّفت.</p>
      <form onSubmit={submit}>
        <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" error={err.email} />
        <Field label="كلمة المرور" type="password" icon="lock" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} placeholder="••••••••" error={err.pass} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", fontSize: "14px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ink-2)", cursor: "pointer", fontWeight: 600 }}>
            <input type="checkbox" style={{ width: 17, height: 17, accentColor: "var(--gold)" }} /> تذكّرني
          </label>
          <button type="button" style={{ color: "var(--gold-700)", fontWeight: 700 }}>نسيت كلمة المرور؟</button>
        </div>
        {general && (
          <p role="alert" style={{ fontSize: "14px", color: "var(--danger)", fontWeight: 700, marginBottom: "18px", lineHeight: 1.7 }}>{general}</p>
        )}
        <Btn variant="primary" size="lg" full type="submit" iconAfter="arrow" disabled={busy}>
          {busy ? "جارٍ تسجيل الدخول…" : "دخول"}
        </Btn>
      </form>
      <div style={{ textAlign: "center", marginTop: "22px", fontSize: "14.5px", color: "var(--ink-2)" }}>
        ليس لديك حساب؟ <Link href="/register" style={{ color: "var(--gold-700)", fontWeight: 800 }}>أنشئ حساباً جديداً</Link>
      </div>
    </AuthShell>
  );
}
