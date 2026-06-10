"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { useLocale } from "@/components/locale-context";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import type { IconName } from "@/components/ui";
import type { CategoryListItem, ContinueItem } from "@/lib/types";

/** لوحة الطالب — منقولة من النموذج الأولي (DashboardPage في page_misc.jsx). */
export function DashboardClient({
  categories,
}: {
  categories: CategoryListItem[];
}) {
  const router = useRouter();
  const { user, summary, loading, isUnlocked } = useAuth();
  const { t, num } = useLocale();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );
  }

  const myCats = categories.filter((c) => isUnlocked(c.id));
  const lockedCats = categories.filter((c) => !isUnlocked(c.id));
  const doneCount = summary?.progress.length ?? 0;
  const continueList: ContinueItem[] = summary?.continueWatching ?? [];

  const stats: { ic: IconName; v: number; l: string; c: string }[] = [
    { ic: "unlock", v: myCats.length, l: t.dashboard.statTracksOpen, c: "var(--green)" },
    { ic: "check", v: doneCount, l: t.dashboard.statLessonsDone, c: "var(--gold-700)" },
    { ic: "clock", v: continueList.length, l: t.dashboard.statInProgress, c: "var(--navy-600)" },
  ];

  return (
    <div style={{ background: "var(--cream)", minHeight: "calc(100vh - 76px)" }}>
      {/* ترحيب */}
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "44px 0 40px", position: "relative", overflow: "hidden" }}>
        <Ornament size={200} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-50px", insetInlineEnd: "5%" }} />
        <div className="wrap" style={{ position: "relative", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <span style={{ width: 70, height: 70, borderRadius: "50%", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", color: "var(--navy-900)", display: "grid", placeItems: "center", fontSize: "30px", fontWeight: 900, flexShrink: 0 }}>{user.name.charAt(0)}</span>
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: "14px", color: "var(--gold-200)", fontWeight: 700 }}>{t.dashboard.greeting}</div>
            <h1 style={{ color: "#fff", fontSize: "30px" }}>{user.name}</h1>
          </div>
          <Btn variant="gold" icon="grid" onClick={() => router.push("/courses")}>{t.dashboard.browseCourses}</Btn>
        </div>
      </section>

      <div className="wrap" style={{ padding: "36px 24px 80px" }}>
        {/* إحصاءات الطالب */}
        <div className="dash-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "18px", marginBottom: "40px" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "var(--paper)", borderRadius: "var(--r)", padding: "22px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ width: 50, height: 50, borderRadius: "14px", background: "var(--cream-2)", color: s.c, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={s.ic} size={24} /></span>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: "var(--navy-900)", lineHeight: 1 }}>{num(s.v)}</div>
                <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "4px" }}>{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        {/* متابعة المشاهدة */}
        {continueList.length > 0 && (
          <div style={{ marginBottom: "44px" }}>
            <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="play" size={20} style={{ color: "var(--gold-700)" }} /> {t.dashboard.continueWatching}</h2>
            <div className="continue-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "18px" }}>
              {continueList.slice(0, 4).map((item) => (
                <button key={item.lessonId} onClick={() => router.push(`/lessons/${item.lessonId}`)}
                  style={{ display: "flex", gap: "16px", background: "var(--paper)", borderRadius: "var(--r)", padding: "16px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", textAlign: "start", transition: "transform .2s", alignItems: "center" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                  <span style={{ width: 64, height: 64, borderRadius: "13px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="play" size={26} /></span>
                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12.5px", color: "var(--gold-700)", fontWeight: 700, marginBottom: "3px" }}>{item.categoryTitle}</div>
                    <div style={{ fontSize: "15.5px", fontWeight: 800, color: "var(--navy-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "2px" }}>{item.levelTitle}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* كورساتي المفتوحة */}
        <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="unlock" size={20} style={{ color: "var(--green)" }} /> {t.dashboard.myCourses}</h2>
        {myCats.length === 0 ? (
          <div style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px dashed var(--line)", padding: "56px 24px", textAlign: "center" }}>
            <div style={{ width: 76, height: 76, borderRadius: "50%", background: "var(--gold-100)", color: "var(--gold-700)", display: "grid", placeItems: "center", margin: "0 auto 20px" }}><Icon name="lock" size={34} /></div>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>{t.dashboard.emptyTitle}</h3>
            <p style={{ color: "var(--ink-2)", fontSize: "15.5px", maxWidth: "420px", margin: "0 auto 24px" }}>{t.dashboard.emptyBody}</p>
            <Btn variant="gold" size="lg" iconAfter="arrow" onClick={() => router.push("/pricing")}>{t.dashboard.browsePlans}</Btn>
          </div>
        ) : (
          <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px", marginBottom: "44px" }}>
            {myCats.map((c) => (
              <button key={c.id} onClick={() => router.push(`/courses/${c.slug}`)} style={{ textAlign: "start", background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", transition: "transform .2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ width: 56, height: 56, borderRadius: "15px", background: "linear-gradient(150deg,var(--navy-600),var(--navy-900))", color: "var(--gold-400)", display: "grid", placeItems: "center" }}><span className="serif" style={{ fontSize: "27px" }}>{c.glyph}</span></span>
                  <Badge tone="green"><Icon name="unlock" size={13} /> {t.common.unlocked}</Badge>
                </div>
                <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{c.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "16px" }}>{num(c.levelsCount)} {t.dashboard.levelUnit}</p>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--navy-700)", fontWeight: 800, fontSize: "14.5px" }}>{t.dashboard.continueLearning} <Icon name="arrow" size={16} /></span>
              </button>
            ))}
          </div>
        )}

        {/* مقترحات لفتحها */}
        {lockedCats.length > 0 && (
          <>
            <h2 style={{ fontSize: "22px", marginBottom: "18px", display: "flex", alignItems: "center", gap: "10px" }}><Icon name="sparkle" size={20} style={{ color: "var(--gold-700)" }} /> {t.dashboard.expandHorizons}</h2>
            <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
              {lockedCats.slice(0, 3).map((c) => (
                <div key={c.id} style={{ background: "var(--paper)", borderRadius: "var(--r-lg)", padding: "26px", border: "1px solid var(--line)", boxShadow: "var(--shadow-sm)", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ width: 56, height: 56, borderRadius: "15px", background: "var(--cream-2)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}><span className="serif" style={{ fontSize: "27px" }}>{c.glyph}</span></span>
                    <Badge tone="line"><Icon name="lock" size={13} /> {t.common.locked}</Badge>
                  </div>
                  <h3 style={{ fontSize: "18px", marginBottom: "6px" }}>{c.title}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "13.5px", marginBottom: "16px" }}>{c.tagline}</p>
                  <Btn variant="outline" size="sm" full icon="unlock" onClick={() => router.push(`/checkout?plan=single&cat=${c.id}`)}>{t.dashboard.openTrack}</Btn>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
