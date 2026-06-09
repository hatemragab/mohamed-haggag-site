import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { Plan } from "@/lib/types";
import { PricingClient } from "./pricing-client";

export const metadata: Metadata = { title: "الباقات والأسعار" };

export default async function PricingPage() {
  const plans = await serverApi<Plan[]>("/plans");
  return <PricingClient plans={[...plans].sort((a, b) => a.order - b.order)} />;
}
