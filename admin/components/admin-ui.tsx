"use client";

import { useEffect } from "react";

/* ===== أيقونات خطّية — نفس مجموعة النموذج الأولي ===== */
export type IconName =
  | "play" | "lock" | "unlock" | "check" | "user" | "search" | "arrow"
  | "arrowL" | "clock" | "book" | "layers" | "chevD" | "chevL" | "chevR"
  | "star" | "menu" | "x" | "globe" | "shield" | "card" | "grid" | "chart"
  | "mail" | "phone" | "whatsapp" | "logout" | "cap" | "sparkle" | "eye"
  | "eyeOff" | "up" | "down";

export function Icon({
  name,
  size = 20,
  stroke = 1.8,
  style,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
  style?: React.CSSProperties;
}) {
  const paths: Record<IconName, React.ReactNode> = {
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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {paths[name] ?? null}
    </svg>
  );
}

/* ===== عناصر إدارية مشتركة — منقولة من النموذج الأولي ===== */
export function AInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  full,
  mono,
  autoFocus,
  after,
}: {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  full?: boolean;
  mono?: boolean;
  autoFocus?: boolean;
  after?: React.ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: "14px", width: full ? "100%" : "auto" }}>
      {label && (
        <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-soft)", marginBottom: "6px" }}>
          {label}
        </span>
      )}
      <span style={{ position: "relative", display: "block" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            width: "100%", background: "var(--panel)", border: "1.5px solid var(--line-dark)",
            borderRadius: "10px", padding: after ? "11px 14px 11px 44px" : "11px 14px",
            fontSize: "14.5px", color: "#fff", outline: "none",
            fontFamily: mono ? "ui-monospace,monospace" : "inherit",
            direction: mono ? "ltr" : "rtl",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
        />
        {after && (
          <span style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: "10px", display: "grid", placeItems: "center" }}>
            {after}
          </span>
        )}
      </span>
    </label>
  );
}

export function AArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      {label && (
        <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-soft)", marginBottom: "6px" }}>
          {label}
        </span>
      )}
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        style={{
          width: "100%", background: "var(--panel)", border: "1.5px solid var(--line-dark)",
          borderRadius: "10px", padding: "11px 14px", fontSize: "14.5px", color: "#fff",
          outline: "none", resize: "vertical", lineHeight: 1.7,
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--line-dark)")}
      />
    </label>
  );
}

export function ASelect({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { v: string; l: string }[];
}) {
  return (
    <label style={{ display: "block", marginBottom: "14px" }}>
      {label && (
        <span style={{ display: "block", fontSize: "13px", fontWeight: 700, color: "var(--text-soft)", marginBottom: "6px" }}>
          {label}
        </span>
      )}
      <select
        value={value}
        onChange={onChange}
        style={{
          width: "100%", background: "var(--panel)", border: "1.5px solid var(--line-dark)",
          borderRadius: "10px", padding: "11px 14px", fontSize: "14.5px", color: "#fff", outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} style={{ background: "var(--panel)" }}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AToggle({
  on,
  onClick,
  label,
}: {
  on: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: "9px", color: "var(--text-soft)", fontSize: "13.5px", fontWeight: 700 }}
    >
      <span style={{ width: 38, height: 22, borderRadius: "999px", background: on ? "var(--gold)" : "var(--line-dark)", position: "relative", transition: "background .2s" }}>
        <span style={{ position: "absolute", top: 2, insetInlineStart: on ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "inset-inline-start .2s" }} />
      </span>
      {label}
    </button>
  );
}

export function ABtn({
  children,
  onClick,
  tone = "gold",
  size = "md",
  icon,
  type = "button",
  full,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "gold" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
  icon?: IconName;
  type?: "button" | "submit";
  full?: boolean;
  disabled?: boolean;
}) {
  const tones: Record<string, React.CSSProperties> = {
    gold: { background: "linear-gradient(180deg,var(--gold-400),var(--gold))", color: "var(--navy-900)" },
    ghost: { background: "#173248", color: "var(--text-soft)" },
    danger: { background: "rgba(180,69,47,.16)", color: "var(--bad)", boxShadow: "inset 0 0 0 1px rgba(180,69,47,.4)" },
    outline: { background: "transparent", color: "var(--text-soft)", boxShadow: "inset 0 0 0 1.5px #2a4863" },
  };
  const sizes = { sm: "8px 14px", md: "11px 20px" };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        borderRadius: "10px", fontWeight: 700, fontSize: size === "sm" ? "13px" : "14.5px",
        padding: sizes[size], cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.6 : 1,
        transition: "filter .2s, transform .1s", width: full ? "100%" : "auto",
        ...tones[tone],
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(1.08)"; }}
      onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 15 : 17} />}
      {children}
    </button>
  );
}

/** نافذة منبثقة — تُغلق بزر Esc أو بالنقر خارجها (مثل النموذج الأولي). */
export function AModal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [onClose]);
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(5,16,28,.7)", backdropFilter: "blur(4px)",
        display: "grid", placeItems: "center", zIndex: 200, padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--card)", border: "1px solid var(--line-dark)", borderRadius: "18px",
          width: "100%", maxWidth: wide ? "640px" : "460px", maxHeight: "88vh", overflow: "auto",
          boxShadow: "var(--shadow-lg)", animation: "scaleIn .25s both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--line-dark)", position: "sticky", top: 0, background: "var(--card)", zIndex: 1 }}>
          <h3 style={{ color: "#fff", fontSize: "18px" }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="إغلاق"
            style={{ width: 34, height: 34, borderRadius: "9px", background: "#173248", color: "var(--text-soft)", display: "grid", placeItems: "center" }}
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: "24px" }}>{children}</div>
      </div>
    </div>
  );
}

export function ACard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--line-dark)", borderRadius: "16px", padding: "22px", ...style }}>
      {children}
    </div>
  );
}

export function AdminHead({
  title,
  sub,
  action,
}: {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "14px", marginBottom: "26px" }}>
      <div>
        <h1 style={{ color: "#fff", fontSize: "27px", marginBottom: "5px" }}>{title}</h1>
        {sub && <p style={{ color: "var(--text-dim)", fontSize: "14.5px" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function confirmDel(msg: string): boolean {
  return window.confirm(msg);
}
