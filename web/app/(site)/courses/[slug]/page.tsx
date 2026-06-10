import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { CategoryDetail, Plan } from "@/lib/types";
import { CategoryClient } from "./category-client";

/** dedupe the category fetch between generateMetadata and the page render */
const getCategory = cache((slug: string) =>
  serverApi<CategoryDetail>(`/categories/${encodeURIComponent(slug)}`),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategory(slug);
    return { title: category.title };
  } catch {
    const t = getDict(await getServerLocale());
    return { title: t.category.metaTitle };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, plans] = await Promise.all([
    // 404 من الـ API يعني مسار غير موجود — باقي الأخطاء تذهب لحدود الخطأ
    getCategory(slug).catch((e: unknown) => {
      if (e instanceof Error && e.message.includes("→ 404")) return null;
      throw e;
    }),
    serverApi<Plan[]>("/plans"),
  ]);
  if (!category) notFound();
  const singlePlan = plans.find((p) => p.key === "single") ?? null;
  return <CategoryClient category={category} singlePlan={singlePlan} />;
}
