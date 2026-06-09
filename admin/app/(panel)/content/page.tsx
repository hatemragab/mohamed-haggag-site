import type { Metadata } from "next";

export const metadata: Metadata = { title: "المحتوى العام" };

import Client from "./client";

export default function Page() {
  return <Client />;
}
