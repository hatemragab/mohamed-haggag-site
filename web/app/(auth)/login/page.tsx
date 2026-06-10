import type { Metadata } from "next";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import LoginClient from "./login-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.auth.metaTitleLogin };
}

export default function LoginPage() {
  return <LoginClient />;
}
