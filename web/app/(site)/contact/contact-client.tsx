"use client";

import { useState } from "react";
import { Badge, Btn, Field, Icon, type IconName } from "@/components/ui";
import { ApiError, apiPost } from "@/lib/client";
import type { SiteContent } from "@/lib/types";

export function ContactClient({ contact }: { contact: SiteContent["contact"] }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", email: "", msg: "" });

  const cards: { ic: IconName; label: string; val: string }[] = [
    { ic: "mail", label: "البريد الإلكتروني", val: contact.email },
    { ic: "whatsapp", label: "واتساب", val: contact.whatsapp },
    { ic: "phone", label: "الهاتف", val: contact.phone },
  ];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setError("");
    setSending(true);
    try {
      await apiPost("/contact", { name: f.name, email: f.email, message: f.msg });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap" style={{ padding: "56px 24px 90px" }}>
      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start" }}>
        <div>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>تواصل معنا</Badge>
          <h1 style={{ fontSize: "clamp(28px,3.6vw,40px)", marginBottom: "14px" }}>نسعد بتواصلك معنا</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.85, marginBottom: "30px" }}>سواء كنت طالباً أو ولي أمر، فريقنا جاهز للإجابة على استفساراتك ومساعدتك في اختيار المسار المناسب.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cards.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", background: "var(--paper)", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" }}>
                <span style={{ width: 48, height: 48, borderRadius: "13px", background: "var(--navy-900)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={c.ic} size={22} /></span>
                <div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>{c.label}</div>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy-900)", direction: "ltr", textAlign: "right" }}>{c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "36px", boxShadow: "var(--shadow)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0", animation: "scaleIn .5s both" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 22px" }}><Icon name="check" size={42} stroke={2.4} /></div>
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>تم إرسال رسالتك!</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "26px" }}>سنتواصل معك في أقرب وقت. شكراً لتواصلك.</p>
              <Btn variant="outline" onClick={() => { setSent(false); setF({ name: "", email: "", msg: "" }); }}>إرسال رسالة أخرى</Btn>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ fontSize: "22px", marginBottom: "22px" }}>أرسل لنا رسالة</h3>
              <Field label="الاسم" icon="user" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="اسمك الكامل" />
              <Field label="البريد الإلكتروني" type="email" icon="mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
              <label style={{ display: "block", marginBottom: "18px" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "8px" }}>رسالتك</span>
                <textarea value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} placeholder="كيف يمكننا مساعدتك؟" rows={5} style={{ width: "100%", border: "1.6px solid var(--line)", borderRadius: "12px", padding: "14px 16px", fontSize: "15.5px", background: "var(--cream)", outline: "none", resize: "vertical", color: "var(--ink)" }} onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--line)"; }} />
              </label>
              {error && (
                <div role="alert" style={{ background: "#faeae6", color: "var(--danger)", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", fontWeight: 700, marginBottom: "18px" }}>{error}</div>
              )}
              <Btn variant="gold" size="lg" full type="submit" iconAfter="arrow" disabled={sending}>{sending ? "جارٍ الإرسال…" : "إرسال الرسالة"}</Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
