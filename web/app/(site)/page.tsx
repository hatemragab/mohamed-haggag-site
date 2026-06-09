import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem, SiteContent, Testimonial } from "@/lib/types";
import { HomeClient } from "./home-client";

export const metadata: Metadata = { title: "الرئيسية" };

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
