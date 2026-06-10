"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, Btn, Field } from "@/components/ui";
import { useAuth } from "@/components/auth-context";
import { useLocale } from "@/components/locale-context";
import { ApiError } from "@/lib/client";
import AuthShell from "../auth-shell";

interface FieldErrors {
  email?: string;
  pass?: string;
}

/* تسجيل الدخول — منقول من النموذج الأولي */
export default function LoginClient() {
  const { login } = useAuth();
  const { t } = useLocale();
  const router = useRouter();
  const [f, setF] = useState({ email: "", pass: "" });
  const [err, setErr] = useState<FieldErrors>({});
  const [general, setGeneral] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const er: FieldErrors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = t.auth.errInvalidEmail;
    if (f.pass.length < 1) er.pass = t.auth.errEnterPassword;
    setErr(er);
    setGeneral("");
    if (Object.keys(er).length > 0) return;
    setBusy(true);
    try {
      await login(f.email.trim(), f.pass);
      router.push("/dashboard");
    } catch (ex) {
      setGeneral(ex instanceof ApiError ? ex.message : t.auth.errConnection);
      setBusy(false);
    }
  };

  return (
    <AuthShell mode="login">
      <Badge tone="gold" style={{ marginBottom: "18px" }}>{t.auth.loginBadge}</Badge>
      <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>{t.auth.loginHeading}</h1>
      <p style={{ color: "var(--ink-2)", fontSize: "15.5px", marginBottom: "30px" }}>{t.auth.loginSubtitle}</p>
      <form onSubmit={submit}>
        <Field label={t.auth.emailLabel} type="email" icon="mail" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" error={err.email} />
        <Field label={t.auth.passwordLabel} type="password" icon="lock" value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} placeholder="••••••••" error={err.pass} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px", fontSize: "14px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--ink-2)", cursor: "pointer", fontWeight: 600 }}>
            <input type="checkbox" style={{ width: 17, height: 17, accentColor: "var(--gold)" }} /> {t.auth.rememberMe}
          </label>
          <button type="button" style={{ color: "var(--gold-700)", fontWeight: 700 }}>{t.auth.forgotPassword}</button>
        </div>
        {general && (
          <p role="alert" style={{ fontSize: "14px", color: "var(--danger)", fontWeight: 700, marginBottom: "18px", lineHeight: 1.7 }}>{general}</p>
        )}
        <Btn variant="primary" size="lg" full type="submit" iconAfter="arrow" disabled={busy}>
          {busy ? t.auth.signingIn : t.auth.signIn}
        </Btn>
      </form>
      <div style={{ textAlign: "center", marginTop: "22px", fontSize: "14.5px", color: "var(--ink-2)" }}>
        {t.auth.noAccountQuestion} <Link href="/register" style={{ color: "var(--gold-700)", fontWeight: 800 }}>{t.auth.createAccountLink}</Link>
      </div>
    </AuthShell>
  );
}
