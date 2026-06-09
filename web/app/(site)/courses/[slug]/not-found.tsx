import Link from "next/link";
import { Icon } from "@/components/ui";

export default function CategoryNotFound() {
  return (
    <div className="boot">
      <div style={{ textAlign: "center", color: "var(--muted)" }}>
        <Icon name="search" size={48} style={{ opacity: 0.4, margin: "0 auto 16px", display: "block" }} />
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>هذا المسار غير موجود.</p>
        <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--navy-700)", fontWeight: 800, fontSize: "15px" }}>
          <Icon name="chevL" size={16} /> كل الكورسات
        </Link>
      </div>
    </div>
  );
}
