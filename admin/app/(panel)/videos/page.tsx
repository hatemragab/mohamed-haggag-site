import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = { title: "الفيديوهات والدروس" };

export default function Page() {
  return <Client />;
}
