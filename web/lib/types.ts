/** API payload types shared across the public site. */

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

export interface PublicLesson {
  id: string;
  title: string;
  durationMinutes: number;
  free: boolean;
  order: number;
}

export interface LevelWithLessons {
  key: string;
  title: string;
  note: string;
  lessons: PublicLesson[];
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

export interface LessonContext {
  lesson: PublicLesson;
  category: { id: string; slug: string; title: string };
  level: { key: string; title: string };
  groupKey: string | null;
  siblings: PublicLesson[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "student" | "admin";
  unlockedAll: boolean;
  unlockedCategories: string[];
}

export interface ContinueItem {
  lessonId: string;
  title: string;
  durationMinutes: number;
  categorySlug: string;
  categoryTitle: string;
  levelTitle: string;
  at: string;
}

export interface MeSummary {
  unlockedAll: boolean;
  unlockedCategories: string[];
  progress: string[];
  continueWatching: ContinueItem[];
}

export interface Order {
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
}

export const CURRENCIES: {
  code: CurrencyCode;
  label: string;
  name: string;
}[] = [
  { code: "AED", label: "د.إ", name: "درهم إماراتي" },
  { code: "EGP", label: "ج.م", name: "جنيه مصري" },
  { code: "USD", label: "$", name: "دولار أمريكي" },
];

/** Eastern-Arabic digits everywhere, like the prototype. */
export const arNum = (n: number) => n.toLocaleString("ar-EG");
