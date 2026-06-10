import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import { AboutClient } from "./about-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.about.metaTitle };
}

export default async function AboutPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <AboutClient instructor={content.instructor} />;
}
