import type { Metadata } from "next";
import { serverApi } from "@/lib/api";
import type { SiteContent } from "@/lib/types";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = { title: "تواصل معنا" };

export default async function ContactPage() {
  const content = await serverApi<SiteContent>("/site-content");
  return <ContactClient contact={content.contact} />;
}
