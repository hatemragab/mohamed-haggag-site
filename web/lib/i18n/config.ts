/**
 * Locale primitives shared by server and client.
 * Arabic is the DEFAULT and is RTL; English is LTR. The chosen locale is stored
 * in the `mh_locale` cookie (readable both server-side via next/headers and
 * client-side via document.cookie).
 */

export type Locale = "ar" | "en";

export const LOCALES: readonly Locale[] = ["ar", "en"] as const;
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "mh_locale";
/** One year — locale is a sticky preference. */
export const LOCALE_MAX_AGE = 60 * 60 * 24 * 365;

export function normalizeLocale(value?: string | null): Locale {
  return value === "en" ? "en" : DEFAULT_LOCALE;
}

export const isRtl = (locale: Locale): boolean => locale === "ar";
export const dir = (locale: Locale): "rtl" | "ltr" =>
  isRtl(locale) ? "rtl" : "ltr";
/** Native language name, used for the language toggle label. */
export const otherLocale = (locale: Locale): Locale =>
  locale === "ar" ? "en" : "ar";
export const localeLabel: Record<Locale, string> = {
  ar: "العربية",
  en: "English",
};

/**
 * Locale-aware number formatting. Arabic → Eastern-Arabic digits (matches the
 * prototype's toLocaleString('ar-EG')); English → Western digits.
 */
export const fmtNum = (n: number, locale: Locale): string =>
  n.toLocaleString(locale === "ar" ? "ar-EG" : "en-US");
