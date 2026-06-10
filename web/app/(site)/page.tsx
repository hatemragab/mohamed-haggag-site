import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { CategoryListItem, SiteContent, Testimonial } from "@/lib/types";
import { HomeClient } from "./home-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.home.metaTitle };
}

export default async function HomePage() {
  const [content, categories, testimonials] = await Promise.all([
    serverApi<SiteContent>("/site-content"),
    serverApi<CategoryListItem[]>("/categories"),
    serverApi<Testimonial[]>("/testimonials"),
  ]);
  return (
    <HomeClient
      content={content}
      categories={categories}
      testimonials={testimonials}
    />
  );
}
