"use client";

import { Btn, Icon } from "@/components/ui";
import { useLocale } from "@/components/locale-context";

export default function CoursesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLocale();
  return (
    <div className="boot">
      <div style={{ textAlign: "center", color: "var(--muted)" }}>
        <Icon name="shield" size={48} style={{ opacity: 0.4, margin: "0 auto 16px", display: "block" }} />
        <p style={{ fontSize: "18px", marginBottom: "20px" }}>{t.courses.errorMessage}</p>
        <Btn variant="outline" onClick={reset}>{t.common.retry}</Btn>
      </div>
    </div>
  );
}
