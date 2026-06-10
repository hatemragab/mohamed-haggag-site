"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { useLocale } from "@/components/locale-context";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import {
  type CategoryDetail,
  type LevelWithLessons,
  type Plan,
  type PublicLesson,
} from "@/lib/types";

interface GroupView {
  key: string;
  title: string | null;
  levels: LevelWithLessons[];
}

export function CategoryClient({
  category,
  singlePlan,
}: {
  category: CategoryDetail;
  singlePlan: Plan | null;
}) {
  const router = useRouter();
  const { isUnlocked } = useAuth();
  const { t, num } = useLocale();
  const unlocked = isUnlocked(category.id);
  // مجموعات الساب (الأزهر فيه groups)
  const groups: GroupView[] =
    category.groups && category.groups.length > 0
      ? category.groups
      : [{ key: "main", title: null, levels: category.levels }];
  const [tab, setTab] = useState(groups[0]?.key ?? "main");
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const activeGroup = groups.find((g) => g.key === tab) ?? groups[0];
  const subs = (activeGroup?.levels ?? []).filter(
    (s) => q === "" || s.title.includes(q) || (s.note ?? "").includes(q),
  );

  const goCheckout = () =>
    router.push(`/checkout?plan=single&cat=${category.id}`);
  const openLesson = (lesson: PublicLesson, canWatch: boolean) =>
    canWatch ? router.push(`/lessons/${lesson.id}`) : goCheckout();

  return (
    <div>
      {/* رأس */}
      <section style={{ background: "linear-gradient(160deg,var(--navy-800),var(--navy-900))", color: "#fff", padding: "44px 0 52px", position: "relative", overflow: "hidden" }}>
        <Ornament size={220} color="rgba(191,145,64,.08)" style={{ position: "absolute", top: "-60px", insetInlineEnd: "3%" }} />
        <div className="wrap" style={{ position: "relative" }}>
          <Link href="/courses" style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "#9fb0bf", fontSize: "14px", fontWeight: 700, marginBottom: "22px" }}><Icon name="chevL" size={16} /> {t.category.allCourses}</Link>
          <div style={{ display: "flex", gap: "22px", alignItems: "flex-start", flexWrap: "wrap" }}>
            <span style={{ width: "78px", height: "78px", borderRadius: "20px", background: "linear-gradient(150deg,var(--gold-400),var(--gold-700))", display: "grid", placeItems: "center", flexShrink: 0 }}>
              <span className="serif" style={{ color: "var(--navy-900)", fontSize: "38px", fontWeight: 700 }}>{category.glyph}</span>
            </span>
            <div style={{ flexGrow: 1, minWidth: "260px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px", flexWrap: "wrap" }}>
                <h1 style={{ color: "#fff", fontSize: "clamp(26px,3.4vw,38px)" }}>{category.title}</h1>
                <Badge tone="gold">{category.level}</Badge>
                {unlocked ? <Badge tone="green"><Icon name="unlock" size={13} /> {t.common.unlocked}</Badge> : <Badge style={{ background: "rgba(255,255,255,.12)", color: "#cdd7e0" }}><Icon name="lock" size={13} /> {t.common.locked}</Badge>}
              </div>
              <div style={{ color: "var(--gold-200)", fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>{category.tagline}</div>
              <p style={{ color: "#c5d2dd", fontSize: "16px", lineHeight: 1.8, maxWidth: "680px" }}>{category.desc}</p>
            </div>
            {!unlocked && (
              <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", borderRadius: "var(--r)", padding: "20px", minWidth: "230px" }}>
                <div style={{ fontSize: "13px", color: "#9fb0bf", marginBottom: "4px" }}>{t.category.unlockTrackFull}</div>
                {singlePlan && (
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "30px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{num(singlePlan.prices.AED)}</span>
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--gold-400)" }}>{t.common.currencies.AED.symbol}</span>
                    <span style={{ fontSize: "12.5px", color: "#9fb0bf" }}>· {t.category.onePayment}</span>
                  </div>
                )}
                <Btn variant="gold" full icon="unlock" onClick={goCheckout}>{t.category.buyTrack}</Btn>
                <div style={{ fontSize: "12px", color: "#9fb0bf", marginTop: "10px", textAlign: "center" }}>{t.category.firstLessonFree}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "44px" }}>
        <div className="wrap">
          {/* تبويبات المجموعات (للأزهر) */}
          {groups.length > 1 && (
            <div style={{ display: "flex", gap: "10px", marginBottom: "26px", flexWrap: "wrap" }}>
              {groups.map((g) => (
                <button key={g.key} onClick={() => { setTab(g.key); setOpenSub(null); }} style={{ padding: "12px 26px", borderRadius: "12px", fontSize: "16px", fontWeight: 800, transition: "all .2s", background: tab === g.key ? "var(--navy-800)" : "var(--paper)", color: tab === g.key ? "#fff" : "var(--ink-2)", boxShadow: tab === g.key ? "var(--shadow)" : "inset 0 0 0 1px var(--line)" }}>{g.title}</button>
              ))}
            </div>
          )}

          {/* بحث داخلي */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--paper)", border: "1px solid var(--line)", borderRadius: "999px", padding: "11px 20px", maxWidth: "380px", marginBottom: "24px" }}>
            <Icon name="search" size={18} style={{ color: "var(--muted)" }} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.category.searchInTrack} style={{ border: "none", background: "transparent", outline: "none", flexGrow: 1, fontSize: "14.5px" }} />
          </div>

          {/* أكورديون الساب-كاتيجوريز */}
          {subs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <Icon name={q ? "search" : "book"} size={48} style={{ opacity: 0.4, margin: "0 auto 16px" }} />
              <p style={{ fontSize: "18px" }}>{q ? t.category.noSearchResults : t.category.noLessons}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {subs.map((sub) => {
                const lessons = sub.lessons;
                const isOpen = openSub === sub.key;
                const totalMin = sub.totalMinutes;
                return (
                  <div key={sub.key} style={{ background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: isOpen ? "var(--shadow)" : "var(--shadow-sm)", transition: "box-shadow .25s" }}>
                    <button onClick={() => setOpenSub(isOpen ? null : sub.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", padding: "20px 24px", textAlign: "start" }}>
                      <span style={{ width: 46, height: 46, borderRadius: "13px", background: isOpen ? "var(--navy-800)" : "var(--cream-2)", color: isOpen ? "var(--gold-400)" : "var(--navy-700)", display: "grid", placeItems: "center", transition: "all .2s", flexShrink: 0 }}><Icon name="book" size={21} /></span>
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--navy-900)" }}>{sub.title}</div>
                        <div style={{ fontSize: "13.5px", color: "var(--muted)", marginTop: "2px", display: "flex", gap: "14px", flexWrap: "wrap" }}>
                          {sub.note && <span style={{ color: "var(--gold-700)", fontWeight: 700 }}>{sub.note}</span>}
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Icon name="play" size={12} /> {num(lessons.length)} {t.category.lessonUnit}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}><Icon name="clock" size={13} /> {num(totalMin)} {t.category.minuteUnit}</span>
                        </div>
                      </div>
                      {!unlocked && <Icon name="lock" size={17} style={{ color: "var(--muted)" }} />}
                      <span style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--cream-2)", color: "var(--navy-800)", display: "grid", placeItems: "center", transition: "transform .25s", transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}><Icon name="chevD" size={16} /></span>
                    </button>
                    <div style={{ maxHeight: isOpen ? `${lessons.length * 86 + 24}px` : "0", overflow: "hidden", transition: "max-height .4s cubic-bezier(.2,.7,.2,1)" }}>
                      <div style={{ borderTop: "1px solid var(--line-2)", padding: "8px" }}>
                        {lessons.map((lesson, li) => (
                          <LessonRow key={lesson.id} lesson={lesson} idx={li + 1} unlocked={unlocked} onOpen={openLesson} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LessonRow({
  lesson,
  idx,
  unlocked,
  onOpen,
}: {
  lesson: PublicLesson;
  idx: number;
  unlocked: boolean;
  onOpen: (lesson: PublicLesson, canWatch: boolean) => void;
}) {
  const { isDone } = useAuth();
  const { t, num } = useLocale();
  const canWatch = unlocked || lesson.free;
  const done = isDone(lesson.id);
  return (
    <button
      onClick={() => onOpen(lesson, canWatch)}
      style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "13px 16px", borderRadius: "12px", textAlign: "start", transition: "background .18s" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "var(--cream)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      <span style={{ width: 38, height: 38, borderRadius: "10px", flexShrink: 0, display: "grid", placeItems: "center",
        background: done ? "var(--green)" : canWatch ? "var(--gold-100)" : "var(--cream-2)",
        color: done ? "#fff" : canWatch ? "var(--gold-700)" : "var(--muted)" }}>
        <Icon name={done ? "check" : canWatch ? "play" : "lock"} size={done ? 18 : 16} stroke={done ? 2.6 : 1.8} />
      </span>
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: canWatch ? "var(--ink)" : "var(--muted)" }}>{t.category.lessonLabel} {num(idx)}: {lesson.title}</div>
        <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "1px" }}>{num(lesson.durationMinutes)} {t.category.minuteUnit}</div>
      </div>
      {lesson.free && !unlocked && <Badge tone="green">{t.category.freePreview}</Badge>}
      {canWatch && <span style={{ color: "var(--navy-600)", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>{t.category.watch} <Icon name="chevL" size={14} /></span>}
    </button>
  );
}
