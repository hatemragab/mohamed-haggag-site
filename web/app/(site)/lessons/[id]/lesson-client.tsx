"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-context";
import { Badge, Btn, Icon, Ornament } from "@/components/ui";
import { ApiError, apiGet } from "@/lib/client";
import { arNum, type LessonContext, type PublicLesson } from "@/lib/types";

/* صفحة الدرس / مشغّل الفيديو — منقولة من النموذج الأولي (LessonPage) */
export function LessonClient({ ctx }: { ctx: LessonContext }) {
  const { lesson, category, level, siblings } = ctx;
  const router = useRouter();
  const {
    user,
    loading: authLoading,
    isUnlocked,
    isDone,
    toggleDone,
    pushContinue,
  } = useAuth();

  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [playError, setPlayError] = useState<{
    status: number;
    message: string;
  } | null>(null);
  const [marking, setMarking] = useState(false);
  const [playHover, setPlayHover] = useState(false);

  const lessons: PublicLesson[] = (
    siblings.length > 0 ? [...siblings] : [lesson]
  ).sort((a, b) => a.order - b.order);
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? lessons[idx - 1] : undefined;
  const next = idx >= 0 ? lessons[idx + 1] : undefined;

  const unlocked = isUnlocked(category.id);
  const watchable = lesson.free || unlocked;
  const done = isDone(lesson.id);
  const checkoutHref = `/checkout?plan=single&cat=${category.id}`;

  const play = async () => {
    if (starting || youtubeId) return;
    setStarting(true);
    setPlayError(null);
    try {
      const res = await apiGet<{ youtubeId: string }>(
        `/lessons/${lesson.id}/watch`,
      );
      setYoutubeId(res.youtubeId);
      if (user) void pushContinue(lesson.id);
    } catch (e) {
      if (e instanceof ApiError)
        setPlayError({ status: e.status, message: e.message });
      else
        setPlayError({ status: 0, message: "تعذّر تشغيل الفيديو، حاول مرة أخرى." });
    } finally {
      setStarting(false);
    }
  };

  const mark = async () => {
    if (!user || marking) return;
    setMarking(true);
    try {
      await toggleDone(lesson.id);
    } catch {
      /* non-fatal: keep current state */
    } finally {
      setMarking(false);
    }
  };

  const goLesson = (l: PublicLesson) =>
    router.push(unlocked || l.free ? `/lessons/${l.id}` : checkoutHref);

  return (
    <div style={{ background: "var(--cream)", minHeight: "80vh" }}>
      <div className="wrap" style={{ padding: "28px 24px 80px" }}>
        <Link
          href={`/courses/${category.slug}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "7px", color: "var(--muted)", fontSize: "14px", fontWeight: 700, marginBottom: "20px" }}
        >
          <Icon name="chevL" size={16} /> {category.title}
        </Link>
        <div className="lesson-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
          {/* المشغّل */}
          <div>
            <div style={{ position: "relative", borderRadius: "var(--r-lg)", overflow: "hidden", aspectRatio: "16/9", background: "linear-gradient(150deg,var(--navy-800),var(--navy-900))", boxShadow: "var(--shadow-lg)", display: "grid", placeItems: "center" }}>
              <Ornament size={200} color="rgba(191,145,64,.07)" style={{ position: "absolute", top: "-40px", insetInlineStart: "-40px" }} />
              {youtubeId ? (
                <iframe
                  title={`الدرس ${lesson.order}: ${lesson.title}`}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1&playsinline=1&color=white`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                ></iframe>
              ) : authLoading && !lesson.free ? (
                /* بانتظار التحقق من الجلسة قبل تحديد حالة القفل */
                <div className="ring" style={{ position: "relative", borderColor: "rgba(255,255,255,.18)", borderTopColor: "var(--gold-400)" }} />
              ) : !watchable ? (
                /* الدرس مغلق — افتح المسار */
                <div style={{ textAlign: "center", position: "relative", padding: "0 24px" }}>
                  <span style={{ width: "84px", height: "84px", borderRadius: "50%", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", color: "var(--gold-400)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
                    <Icon name="lock" size={34} />
                  </span>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>هذا الدرس مغلق</div>
                  <div style={{ color: "#9fb0bf", fontSize: "13px", marginTop: "4px" }}>درس مصوّر · {arNum(lesson.durationMinutes)} دقيقة</div>
                  <div style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}>
                    <Btn variant="gold" icon="unlock" onClick={() => router.push(checkoutHref)}>افتح المسار</Btn>
                  </div>
                </div>
              ) : playError ? (
                /* فشل جلب الفيديو — رسالة + إجراء */
                <div style={{ textAlign: "center", position: "relative", padding: "0 24px" }}>
                  <span style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", color: "var(--gold-400)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}>
                    <Icon name={playError.status === 401 ? "user" : "lock"} size={26} />
                  </span>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>{playError.message}</div>
                  <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                    {playError.status === 401 ? (
                      <Btn variant="gold" icon="user" onClick={() => router.push("/login")}>تسجيل الدخول</Btn>
                    ) : playError.status === 403 ? (
                      <Btn variant="gold" icon="unlock" onClick={() => router.push(checkoutHref)}>افتح المسار</Btn>
                    ) : (
                      <Btn variant="gold" icon="play" onClick={() => void play()}>إعادة المحاولة</Btn>
                    )}
                  </div>
                </div>
              ) : (
                /* بوستر قبل التشغيل */
                <div style={{ textAlign: "center", position: "relative" }}>
                  <button
                    onClick={() => void play()}
                    disabled={starting}
                    aria-label="اضغط للتشغيل"
                    onMouseEnter={() => setPlayHover(true)}
                    onMouseLeave={() => setPlayHover(false)}
                    style={{ width: "84px", height: "84px", borderRadius: "50%", background: "var(--gold)", color: "var(--navy-900)", display: "grid", placeItems: "center", margin: "0 auto 18px", boxShadow: "0 8px 30px rgba(191,145,64,.5)", transition: "transform .2s", transform: playHover && !starting ? "scale(1.08)" : "scale(1)" }}
                  >
                    {starting ? (
                      <div className="ring" style={{ width: "30px", height: "30px", borderColor: "rgba(10,31,54,.25)", borderTopColor: "var(--navy-900)" }} />
                    ) : (
                      <Icon name="play" size={34} />
                    )}
                  </button>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>اضغط للتشغيل</div>
                  <div style={{ color: "#9fb0bf", fontSize: "13px", marginTop: "4px" }}>درس مصوّر · {arNum(lesson.durationMinutes)} دقيقة</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", padding: "6px 14px", borderRadius: "999px", color: "#cdd7e0", fontSize: "12px", fontWeight: 700 }}>
                    <Icon name="shield" size={13} /> فيديو محمي
                  </div>
                </div>
              )}
            </div>

            {/* عنوان ومعلومات الدرس */}
            <div style={{ marginTop: "26px" }}>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                <Badge tone="navy">{category.title}</Badge>
                <Badge tone="gold">{level.title}</Badge>
                {lesson.free && <Badge tone="green">معاينة مجانية</Badge>}
              </div>
              <h1 style={{ fontSize: "clamp(24px,3vw,32px)", marginBottom: "12px" }}>الدرس {arNum(lesson.order)}: {lesson.title}</h1>
              <div style={{ display: "flex", gap: "20px", color: "var(--muted)", fontSize: "14.5px", fontWeight: 600, marginBottom: "20px", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="clock" size={16} /> {arNum(lesson.durationMinutes)} دقيقة</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="user" size={16} /> الأستاذ محمد حجاج</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}><Icon name="layers" size={16} /> الدرس {arNum(lesson.order)} من {arNum(lessons.length)}</span>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", padding: "20px", background: "var(--paper)", borderRadius: "var(--r)", border: "1px solid var(--line)" }}>
                {user ? (
                  <Btn variant={done ? "soft" : "primary"} icon="check" disabled={marking} onClick={() => void mark()}>{done ? "تم الإكمال ✓" : "تحديد كمكتمل"}</Btn>
                ) : (
                  <span style={{ display: "inline-flex", flexDirection: "column", gap: "4px" }}>
                    <Btn variant="primary" icon="check" disabled>تحديد كمكتمل</Btn>
                    <span style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textAlign: "center" }}>سجّل الدخول لحفظ تقدّمك</span>
                  </span>
                )}
                {prev && <Btn variant="ghost" icon="chevR" onClick={() => router.push(`/lessons/${prev.id}`)}>الدرس السابق</Btn>}
                {next ? (
                  <Btn variant="outline" iconAfter="chevL" onClick={() => goLesson(next)} style={{ marginInlineStart: "auto" }}>الدرس التالي</Btn>
                ) : (
                  <Badge tone="green" style={{ marginInlineStart: "auto", padding: "10px 16px" }}><Icon name="cap" size={15} /> نهاية الوحدة</Badge>
                )}
              </div>
            </div>
          </div>

          {/* قائمة دروس الوحدة */}
          <aside style={{ position: "sticky", top: "92px", background: "var(--paper)", borderRadius: "var(--r-lg)", border: "1px solid var(--line)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--line-2)", background: "var(--cream)" }}>
              <div style={{ fontWeight: 800, fontSize: "16px", color: "var(--navy-900)" }}>دروس الوحدة</div>
              <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{level.title}</div>
            </div>
            <div style={{ maxHeight: "560px", overflowY: "auto", padding: "8px" }}>
              {lessons.map((l) => {
                const can = unlocked || l.free;
                const active = l.id === lesson.id;
                const ld = isDone(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => goLesson(l)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "11px", textAlign: "right", background: active ? "var(--gold-100)" : "transparent", transition: "background .18s", marginBottom: "2px" }}
                  >
                    <span style={{ width: 32, height: 32, borderRadius: "9px", flexShrink: 0, display: "grid", placeItems: "center", background: ld ? "var(--green)" : active ? "var(--gold)" : "var(--cream-2)", color: ld ? "#fff" : active ? "#fff" : can ? "var(--navy-700)" : "var(--muted)" }}>
                      <Icon name={ld ? "check" : can ? "play" : "lock"} size={ld ? 15 : 13} stroke={ld ? 2.6 : 1.8} />
                    </span>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: active ? "var(--navy-900)" : can ? "var(--ink)" : "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{arNum(l.order)}. {l.title}</div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)" }}>{arNum(l.durationMinutes)} دقيقة</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
