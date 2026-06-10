import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem } from "@/lib/types";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import { CoursesClient } from "./courses-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.courses.metaTitle };
}

export default async function CoursesPage() {
  const categories = await serverApi<CategoryListItem[]>("/categories");
  return <CoursesClient categories={categories} />;
}
