import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem, Plan } from "@/lib/types";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = { title: "إتمام الدفع" };

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
