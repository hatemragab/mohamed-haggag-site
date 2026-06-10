import type { Metadata } from "next";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import RegisterClient from "./register-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.auth.metaTitleRegister };
}

export default function RegisterPage() {
  return <RegisterClient />;
}
