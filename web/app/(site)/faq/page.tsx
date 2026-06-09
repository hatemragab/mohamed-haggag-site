import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { FaqClient } from "./faq-client";

export const metadata: Metadata = { title: "الأسئلة الشائعة" };

export default async function FaqPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <FaqClient faq={content.faq} />;
}
