import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem } from "@/lib/types";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import { DashboardClient } from "./dashboard-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.dashboard.metaTitle };
}

export default async function DashboardPage() {
  const categories = await serverApi<CategoryListItem[]>("/categories");
  return <DashboardClient categories={categories} />;
}
