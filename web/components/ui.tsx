"use client";

import { useEffect, useRef, useState } from "react";
import { arNum } from "@/lib/types";

/* ===== أيقونات خطّية بسيطة — منقولة من النموذج الأولي ===== */
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

/* ===== زر ===== */
export function Btn({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  onClick,
  full,
  type = "button",
  style,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "gold" | "outline" | "ghost" | "soft" | "white";
  size?: "sm" | "md" | "lg";
  icon?: IconName;
  iconAfter?: IconName;
  onClick?: () => void;
  full?: boolean;
  type?: "button" | "submit";
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const [h, setH] = useState(false);
  const base: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px",
    fontWeight: 700, fontFamily: "var(--font)", borderRadius: "999px", cursor: disabled ? "default" : "pointer",
    transition: "all .2s cubic-bezier(.2,.7,.2,1)", whiteSpace: "nowrap",
    width: full ? "100%" : "auto", letterSpacing: ".01em", opacity: disabled ? 0.6 : 1,
  };
  const sizes = {
    sm: { padding: "9px 18px", fontSize: "14px" },
    md: { padding: "13px 26px", fontSize: "15.5px" },
    lg: { padding: "17px 36px", fontSize: "17px" },
  } as const;
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: "linear-gradient(180deg,var(--navy-700),var(--navy-900))", color: "#fff", boxShadow: "0 4px 14px rgba(14,41,68,.28)" },
    gold: { background: "linear-gradient(180deg,var(--gold-400),var(--gold))", color: "var(--navy-900)", boxShadow: "0 4px 14px rgba(191,145,64,.35)" },
    outline: { background: "transparent", color: "var(--navy-800)", boxShadow: "inset 0 0 0 1.6px var(--navy-800)" },
    ghost: { background: "var(--cream-2)", color: "var(--navy-800)" },
    soft: { background: "var(--gold-100)", color: "var(--gold-700)" },
    white: { background: "#fff", color: "var(--navy-900)", boxShadow: "var(--shadow-sm)" },
  };
  const hover: React.CSSProperties =
    h && !disabled
      ? {
          transform: "translateY(-2px)",
          filter: "brightness(1.04)",
          boxShadow:
            variant === "gold"
              ? "0 8px 22px rgba(191,145,64,.45)"
              : "0 8px 22px rgba(14,41,68,.32)",
        }
      : {};
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...hover, ...style }}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 20 : 18} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={size === "lg" ? 20 : 18} />}
    </button>
  );
}

/* ===== شارة ===== */
export function Badge({
  children,
  tone = "navy",
  style,
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "green" | "muted" | "line";
  style?: React.CSSProperties;
}) {
  const tones: Record<string, React.CSSProperties> = {
    navy: { background: "var(--navy-800)", color: "#fff" },
    gold: { background: "var(--gold-100)", color: "var(--gold-700)" },
    green: { background: "#e4efe9", color: "var(--green)" },
    muted: { background: "var(--cream-2)", color: "var(--ink-2)" },
    line: { background: "transparent", color: "var(--ink-2)", boxShadow: "inset 0 0 0 1px var(--line)" },
  };
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px",
        fontWeight: 700, padding: "5px 12px", borderRadius: "999px",
        ...tones[tone], ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ===== عدّاد متحرّك — يبدأ عند ظهوره على الشاشة ===== */
export function Counter({
  value,
  suffix = "",
  dur = 1600,
}: {
  value: number;
  suffix?: string;
  dur?: number;
}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - start) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setN(Math.round(value * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      run();
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, dur]);
  return (
    <span ref={ref}>
      {arNum(n)}
      {suffix}
    </span>
  );
}

/* ===== زخرفة هندسية إسلامية ===== */
export function Ornament({
  size = 60,
  color = "var(--gold)",
  style,
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={style} aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.3">
        <path d="M30 6 L54 30 L30 54 L6 30 Z" />
        <path d="M30 16 L44 30 L30 44 L16 30 Z" />
        <circle cx="30" cy="30" r="5" />
        <line x1="30" y1="6" x2="30" y2="54" />
        <line x1="6" y1="30" x2="54" y2="30" />
      </g>
    </svg>
  );
}

/* ===== حقل إدخال (صفحات الحساب والدفع) ===== */
export function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  hint,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: IconName;
  error?: string;
  hint?: string;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <label style={{ display: "block", marginBottom: "18px" }}>
      <span style={{ display: "block", fontSize: "14px", fontWeight: 700, color: "var(--navy-900)", marginBottom: "8px" }}>
        {label}
      </span>
      <span
        style={{
          display: "flex", alignItems: "center", gap: "10px", background: "var(--cream)",
          border: `1.6px solid ${error ? "var(--danger)" : focus ? "var(--gold)" : "var(--line)"}`,
          borderRadius: "12px", padding: "13px 16px", transition: "border-color .2s",
        }}
      >
        {icon && <Icon name={icon} size={19} style={{ color: focus ? "var(--gold-700)" : "var(--muted)" }} />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "15.5px", color: "var(--ink)" }}
        />
      </span>
      {error && (
        <span style={{ display: "block", fontSize: "13px", color: "var(--danger)", marginTop: "6px", fontWeight: 600 }}>
          {error}
        </span>
      )}
      {hint && !error && (
        <span style={{ display: "block", fontSize: "12.5px", color: "var(--muted)", marginTop: "6px" }}>
          {hint}
        </span>
      )}
    </label>
  );
}
