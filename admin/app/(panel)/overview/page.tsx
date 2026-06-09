import type { Metadata } from "next";
import Client from "./client";

export const metadata: Metadata = { title: "نظرة عامة" };

export default function Page() {
  return <Client />;
}
