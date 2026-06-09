"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ABtn, AInput, Icon } from "@/components/admin-ui";
import { useAdminAuth } from "@/components/auth-context";
import { ApiError } from "@/lib/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function AdminLoginPage() {
  const { admin, loading, login } = useAdminAuth();
  const router = useRouter();
  const [f, setF] = useState({ user: "", pass: "" });
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && admin) router.replace("/");
  }, [loading, admin, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    login(f.user, f.pass)
      .then(() => router.replace("/"))
      .catch((error: unknown) => {
        setErr(
          error instanceof ApiError
            ? error.message
            : "اسم المستخدم أو كلمة المرور غير صحيحة",
        );
      })
      .finally(() => setBusy(false));
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(circle at 30% 20%, var(--navy-700), var(--navy-900) 60%)", display: "grid", placeItems: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }} className="page-fade">
        <a
          href={SITE_URL}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--text-mute)", fontSize: "13.5px", fontWeight: 700, marginBottom: "26px" }}
        >
          <Icon name="chevR" size={16} /> العودة للموقع
        </a>
        <div style={{ background: "var(--card)", border: "1px solid var(--line-dark)", borderRadius: "22px", padding: "40px", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "26px" }}>
            <span style={{ width: 52, height: 52, borderRadius: "15px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", color: "var(--navy-900)" }}>
              <Icon name="shield" size={26} />
            </span>
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: "19px" }}>لوحة تحكم الإدارة</div>
              <div style={{ color: "var(--gold-400)", fontSize: "13px", fontWeight: 700 }}>منصة الأستاذ محمد حجاج</div>
            </div>
          </div>
          <form onSubmit={submit}>
            <AInput
              label="اسم المستخدم"
              autoFocus
              value={f.user}
              onChange={(e) => setF({ ...f, user: e.target.value })}
              placeholder="admin"
            />
            <AInput
              label="كلمة المرور"
              type={show ? "text" : "password"}
              value={f.pass}
              onChange={(e) => setF({ ...f, pass: e.target.value })}
              placeholder="••••••••"
              after={
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  title={show ? "إخفاء" : "إظهار"}
                  style={{ color: "var(--text-dim)", display: "grid", placeItems: "center" }}
                >
                  <Icon name={show ? "eyeOff" : "eye"} size={18} />
                </button>
              }
            />
            {err && (
              <div style={{ color: "var(--bad)", fontSize: "13.5px", fontWeight: 600, marginBottom: "12px" }}>{err}</div>
            )}
            <ABtn type="submit" full icon="logout" disabled={busy}>
              {busy ? "جارٍ الدخول…" : "دخول لوحة التحكم"}
            </ABtn>
          </form>
        </div>
      </div>
    </div>
  );
}
