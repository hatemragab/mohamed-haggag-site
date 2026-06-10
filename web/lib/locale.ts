import { cookies } from "next/headers";
import { Locale, LOCALE_COOKIE, normalizeLocale } from "@/lib/i18n/config";

/**
 * Resolve the active locale on the server (layout + generateMetadata).
 * Reads the mh_locale cookie; defaults to Arabic.
 */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  return normalizeLocale(store.get(LOCALE_COOKIE)?.value);
}
