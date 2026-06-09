import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem } from "@/lib/types";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = { title: "لوحة الطالب" };

export default async function DashboardPage() {
  const categories = await serverApi<CategoryListItem[]>("/categories");
  return <DashboardClient categories={categories} />;
}
