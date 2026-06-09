import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { CategoryListItem } from "@/lib/types";
import { CoursesClient } from "./courses-client";

export const metadata: Metadata = { title: "الكورسات" };

export default async function CoursesPage() {
  const categories = await serverApi<CategoryListItem[]>("/categories");
  return <CoursesClient categories={categories} />;
}
