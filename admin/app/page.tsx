"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LAST_TAB_KEY, TABS } from "@/components/shell";

/** Root: jump back to the last active tab (prototype behavior), else overview. */
export default function RootRedirect() {
  const router = useRouter();
  useEffect(() => {
    let target = "/overview";
    try {
      const saved = localStorage.getItem(LAST_TAB_KEY);
      if (saved && TABS.some((t) => saved.startsWith(t.href))) target = saved;
    } catch {
      /* localStorage may be unavailable */
    }
    router.replace(target);
  }, [router]);
  return (
    <div className="boot">
      <div className="ring" />
    </div>
  );
}
