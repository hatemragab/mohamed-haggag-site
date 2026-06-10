import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import { FaqClient } from "./faq-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.faq.metaTitle };
}

export default async function FaqPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <FaqClient faq={content.faq} />;
}
