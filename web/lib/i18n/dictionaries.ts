import { ar } from "./ar";
import { Locale } from "./config";
import { en } from "./en";

/** Arabic is the canonical shape; English must structurally match it. */
export type Dict = typeof ar;

const DICTS = { ar, en } satisfies Record<Locale, Dict>;

export const getDict = (locale: Locale): Dict => DICTS[locale];
