import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { SiteContent } from "@/lib/types";
import { ContactClient } from "./contact-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.contact.metaTitle };
}

export default async function ContactPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <ContactClient contact={content.contact} />;
}
