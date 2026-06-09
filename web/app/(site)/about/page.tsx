import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { AboutClient } from "./about-client";

export const metadata: Metadata = { title: "عن الأستاذ" };

export default async function AboutPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <AboutClient instructor={content.instructor} />;
}
