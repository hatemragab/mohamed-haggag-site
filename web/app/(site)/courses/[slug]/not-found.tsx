import Link from "next/link";
import { Icon } from "@/components/ui";
import { getDict } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/locale";

export default async function CategoryNotFound() {
  const t = getDict(await getServerLocale());
  return (
    <div className="boot">
      <div style={{ textAlign: "center", color: "var(--muted)" }}>
        <Icon name="search" size={48} style={{ opacity: 0.4, margin: "0 auto 16px", display: "block" }} />
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{t.category.notFoundText}</p>
        <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--navy-700)", fontWeight: 800, fontSize: "15px" }}>
          <Icon name="chevL" size={16} /> {t.category.allCourses}
        </Link>
      </div>
    </div>
  );
}
