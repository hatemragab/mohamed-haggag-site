import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = { title: "الأقسام والمستويات" };

export default function Page() {
  return <Client />;
}
