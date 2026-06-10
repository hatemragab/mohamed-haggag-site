import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { Plan } from "@/lib/types";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import { PricingClient } from "./pricing-client";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDict(await getServerLocale());
  return { title: t.pricing.metaTitle };
}

export default async function PricingPage() {
  const plans = await serverApi<Plan[]>("/plans");
  return <PricingClient plans={[...plans].sort((a, b) => a.order - b.order)} />;
}
