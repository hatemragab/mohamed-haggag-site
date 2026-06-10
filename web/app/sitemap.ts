import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const API_URL = process.env.API_URL ?? "http://localhost:4000";

const STATIC_ROUTES = ["/", "/courses", "/pricing", "/about", "/faq", "/contact", "/terms"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  try {
    const res = await fetch(`${API_URL}/categories`, { cache: "no-store" });
    if (res.ok) {
      const categories = (await res.json()) as { slug: string }[];
      for (const { slug } of categories) {
        entries.push({
          url: `${SITE_URL}/courses/${slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  } catch {
    // API unreachable — fall back to static routes; the sitemap must never crash the build.
  }

  return entries;
}
