import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { CategoryListItem, Plan } from "@/lib/types";
import { CheckoutClient } from "./checkout-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.checkout.metaTitle };
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; cat?: string }>;
}) {
  const [{ plan, cat }, plans, categories] = await Promise.all([
    searchParams,
    serverApi<Plan[]>("/plans"),
    serverApi<CategoryListItem[]>("/categories"),
  ]);
  return (
    <CheckoutClient
      plans={[...plans].sort((a, b) => a.order - b.order)}
      categories={categories}
      planKey={plan ?? null}
      catId={cat ?? null}
    />
  );
}
