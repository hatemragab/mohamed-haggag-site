"use client";

import { Btn, Icon } from "@/components/ui";

export default function CoursesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="boot">
      <div style={{ textAlign: "center", color: "var(--muted)" }}>
        <Icon name="shield" size={48} style={{ opacity: 0.4, margin: "0 auto 16px", display: "block" }} />
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>تعذّر تحميل الصفحة. حاول مرة أخرى.</p>
        <Btn variant="outline" onClick={reset}>إعادة المحاولة</Btn>
      </div>
    </div>
  );
}
