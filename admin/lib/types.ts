/** API payload types used by the admin panel. */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "student" | "admin";
  unlockedAll: boolean;
  unlockedCategories: string[];
}

export interface LevelSub {
  key: string;
  title: string;
  note: string;
}

export interface CategoryListItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  desc: string;
  glyph: string;
  level: string;
  order: number;
  levelsCount: number;
  groups?: { key: string; title: string }[];
}

export interface LevelWithLessons {
  key: string;
  title: string;
  note: string;
  lessons: { id: string; title: string; durationMinutes: number; free: boolean; order: number }[];
  totalMinutes: number;
}

export interface CategoryDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  desc: string;
  glyph: string;
  level: string;
  groups?: { key: string; title: string; levels: LevelWithLessons[] }[];
  levels: LevelWithLessons[];
}

export interface AdminLesson {
  id: string;
  categoryId: string;
  groupKey: string | null;
  levelKey: string;
  title: string;
  youtubeId: string;
  durationMinutes: number;
  free: boolean;
  order: number;
}

export type PlanKey = "single" | "monthly" | "bundle";
export type CurrencyCode = "AED" | "EGP" | "USD";

export interface Plan {
  key: PlanKey;
  name: string;
  tagline: string;
  prices: Record<CurrencyCode, number>;
  period: string;
  features: string[];
  cta: string;
  highlight: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  order: number;
}

export interface SiteContent {
  hero: { title: string; sub: string };
  instructor: {
    name: string;
    title: string;
    short: string;
    bio: string[];
    credentials: string[];
    stats: { value: number; suffix: string; label: string }[];
  };
  why: { glyph: string; title: string; text: string }[];
  learnSection: { title: string; text: string; quote: string };
  learn: string[];
  accessSteps: { n: number; title: string; text: string }[];
  faq: { q: string; a: string }[];
  contact: { email: string; whatsapp: string; phone: string };
  terms: { title: string; body: string }[];
  footerText: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan: string;
  joined: string;
  status: "active" | "suspended";
}

export interface AdminOrder {
  id: string;
  planKey: PlanKey;
  planName: string;
  categoryId: string | null;
  amount: number;
  currency: CurrencyCode;
  status: "pending" | "paid" | "failed" | "refunded";
  provider: "paymob" | "stripe";
  createdAt: string;
  paidAt: string | null;
  student: string;
  email: string;
}

export interface Overview {
  kpis: { students: number; categories: number; lessons: number; payments: number };
  revenue: Record<string, number>;
  latestPayments: {
    id: string;
    student: string;
    plan: string;
    amount: number;
    currency: CurrencyCode;
    status: string;
    date: string;
  }[];
  displayedStats: { value: number; suffix: string; label: string }[];
}

export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  AED: "د.إ",
  EGP: "ج.م",
  USD: "$",
};

export const ORDER_STATUS_AR: Record<AdminOrder["status"], string> = {
  pending: "قيد الانتظار",
  paid: "ناجح",
  failed: "فاشل",
  refunded: "مسترد",
};

/** Eastern-Arabic digits everywhere, like the prototype. */
export const arNum = (n: number) => n.toLocaleString("ar-EG");

/** Format an ISO date in Arabic digits like the prototype's ٢٠٢٦/٠٥/١٢. */
export const arDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ar-EG-u-nu-arab", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
