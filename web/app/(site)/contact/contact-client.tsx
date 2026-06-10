"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-context";
import { Badge, Btn, Field, Icon, type IconName } from "@/components/ui";
import { ApiError, apiPost } from "@/lib/client";
import type { SiteContent } from "@/lib/types";

// Fallbacks for site-content docs seeded before these contact fields existed;
// admin-entered values (when present) always win.
const WHATSAPP_QR_LINK = "https://wa.me/qr/EYLQ7UJNSD26H1";
const FACEBOOK_PAGE = "https://www.facebook.com/share/17rpnUeHDs/";

// Admin-stored values land in href — only web URLs may pass, so a compromised
// admin account can't plant javascript: links on the public site.
const safeHttpUrl = (u?: string) => {
  try {
    const p = new URL(u ?? "");
    return p.protocol === "https:" || p.protocol === "http:" ? p.toString() : null;
  } catch {
    return null;
  }
};

export function ContactClient({ contact }: { contact: SiteContent["contact"] }) {
  const { t } = useLocale();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", email: "", msg: "" });

  const waLink = safeHttpUrl(contact.whatsappQr) ?? WHATSAPP_QR_LINK;
  const fbLink = safeHttpUrl(contact.facebook) ?? FACEBOOK_PAGE;

  const cards: { ic: IconName; label: string; val: string; href?: string; ltr?: boolean }[] = [
    { ic: "mail", label: t.contact.emailLabel, val: contact.email, href: `mailto:${contact.email}`, ltr: true },
    { ic: "whatsapp", label: t.contact.whatsappLabel, val: contact.whatsapp, href: waLink, ltr: true },
    { ic: "phone", label: t.contact.phoneLabel, val: contact.phone, ltr: true },
    { ic: "facebook", label: t.contact.facebookLabel, val: t.contact.facebookValue, href: fbLink },
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
      setError(err instanceof ApiError ? err.message : t.common.errorGeneric);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wrap" style={{ padding: "56px 24px 90px" }}>
      <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "48px", alignItems: "start" }}>
        <div>
          <Badge tone="gold" style={{ marginBottom: "16px" }}>{t.contact.badge}</Badge>
          <h1 style={{ fontSize: "clamp(28px,3.6vw,40px)", marginBottom: "14px" }}>{t.contact.heading}</h1>
          <p style={{ color: "var(--ink-2)", fontSize: "16.5px", lineHeight: 1.85, marginBottom: "30px" }}>{t.contact.intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cards.map((c, i) => {
              const inner = (
                <>
                  <span style={{ width: 48, height: 48, borderRadius: "13px", background: "var(--navy-900)", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={c.ic} size={22} /></span>
                  <div>
                    <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--navy-900)", direction: c.ltr ? "ltr" : undefined, textAlign: "start" }}>{c.val}</div>
                  </div>
                </>
              );
              const boxStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "16px", background: "var(--paper)", borderRadius: "var(--r)", padding: "18px 20px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)" };
              return c.href ? (
                <a
                  key={i}
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  style={{ ...boxStyle, transition: "border-color .2s, transform .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--line)"; e.currentTarget.style.transform = "none"; }}
                >
                  {inner}
                </a>
              ) : (
                <div key={i} style={boxStyle}>{inner}</div>
              );
            })}
          </div>

          {/* QR واتساب */}
          <div style={{ marginTop: "16px", background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "26px 24px", boxShadow: "var(--shadow-sm)", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontWeight: 800, fontSize: "16.5px", color: "var(--navy-900)", marginBottom: "8px" }}>
              <span style={{ width: 30, height: 30, borderRadius: "9px", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center" }}><Icon name="whatsapp" size={17} /></span>
              {t.contact.qrTitle}
            </div>
            <p style={{ color: "var(--ink-2)", fontSize: "14px", lineHeight: 1.8, marginBottom: "14px" }}>{t.contact.qrHint}</p>
            <img src="/whatsapp-qr.png" alt={t.contact.qrAlt} width={190} height={190} loading="lazy" style={{ display: "block", margin: "0 auto 12px", borderRadius: "14px", border: "1px solid var(--line-2)", background: "#fff" }} />
            <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--green)", fontWeight: 800, fontSize: "14.5px" }}>
              <Icon name="whatsapp" size={16} /> {t.contact.qrOpenChat}
            </a>
          </div>
        </div>
        <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", padding: "36px", boxShadow: "var(--shadow)" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0", animation: "scaleIn .5s both" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--green)", color: "#fff", display: "grid", placeItems: "center", margin: "0 auto 22px" }}><Icon name="check" size={42} stroke={2.4} /></div>
              <h3 style={{ fontSize: "24px", marginBottom: "10px" }}>{t.contact.sentHeading}</h3>
              <p style={{ color: "var(--ink-2)", fontSize: "16px", marginBottom: "26px" }}>{t.contact.sentBody}</p>
              <Btn variant="outline" onClick={() => { setSent(false); setF({ name: "", email: "", msg: "" }); }}>{t.contact.sendAnother}</Btn>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3 style={{ fontSize: "22px", marginBottom: "22px" }}>{t.contact.formHeading}</h3>
              <Field label={t.contact.nameLabel} icon="user" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder={t.contact.namePlaceholder} />
              <Field label={t.contact.emailLabel} type="email" icon="mail" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
              <label style={{ display: "block", marginBottom: "18px" }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "8px" }}>{t.contact.messageLabel}</span>
                <textarea value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} placeholder={t.contact.messagePlaceholder} rows={5} style={{ width: "100%", border: "1.6px solid var(--line)", borderRadius: "12px", padding: "14px 16px", fontSize: "15.5px", background: "var(--cream)", outline: "none", resize: "vertical", color: "var(--ink)" }} onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--line)"; }} />
              </label>
              {error && (
                <div role="alert" style={{ background: "#faeae6", color: "var(--danger)", borderRadius: "12px", padding: "12px 16px", fontSize: "14px", fontWeight: 700, marginBottom: "18px" }}>{error}</div>
              )}
              <Btn variant="gold" size="lg" full type="submit" iconAfter="arrow" disabled={sending}>{sending ? t.contact.sending : t.contact.submit}</Btn>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
