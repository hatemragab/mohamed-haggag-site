"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  dir as dirOf,
  fmtNum,
  Locale,
  LOCALE_COOKIE,
  LOCALE_MAX_AGE,
  otherLocale,
} from "@/lib/i18n/config";
import { Dict, getDict } from "@/lib/i18n/dictionaries";

interface LocaleCtx {
  locale: Locale;
  dir: "rtl" | "ltr";
  /** Resolved dictionary for the active locale — e.g. `t.header.nav.home`. */
  t: Dict;
  /** Locale-aware number formatting (Eastern-Arabic digits for ar). */
  num: (n: number) => string;
  setLocale: (next: Locale) => void;
  toggle: () => void;
}

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      // Persist the preference; the API reads it via Accept-Language (set in
      // lib/client.ts) and server components read the cookie on refresh.
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=${LOCALE_MAX_AGE};samesite=lax`;
      // Flip <html> immediately so direction/lang/font update without a reload.
      const root = document.documentElement;
      root.lang = next;
      root.dir = dirOf(next);
      root.classList.remove("loc-ar", "loc-en");
      root.classList.add(`loc-${next}`);
      setLocaleState(next);
      // Re-render server components (metadata, server-fetched chrome) with the
      // new cookie.
      router.refresh();
    },
    [locale, router],
  );

  const value = useMemo<LocaleCtx>(
    () => ({
      locale,
      dir: dirOf(locale),
      t: getDict(locale),
      num: (n: number) => fmtNum(n, locale),
      setLocale,
      toggle: () => setLocale(otherLocale(locale)),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleCtx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
