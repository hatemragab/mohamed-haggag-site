import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { serverApi } from "@/lib/api";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";
import type { LessonContext } from "@/lib/types";
import { LessonClient } from "./lesson-client";

/** Deduped per-request: generateMetadata + the page share one fetch. */
const getLessonContext = cache(
  async (id: string): Promise<LessonContext | null> => {
    try {
      return await serverApi<LessonContext>(
        `/lessons/${encodeURIComponent(id)}/context`,
      );
    } catch {
      return null;
    }
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ctx = await getLessonContext(id);
  const t = getDict(await getServerLocale());
  return { title: ctx ? ctx.lesson.title : t.lesson.metaTitle };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ctx = await getLessonContext(id);
  if (!ctx) notFound();
  return <LessonClient ctx={ctx} />;
}
