"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon, Ornament } from "@/components/ui";
import { useAuth } from "@/components/auth-context";

/* تخطيط صفحات الحساب (عمودان) — منقول من النموذج الأولي */
export default function AuthShell({
  mode,
  children,
}: {
  mode: "register" | "login";
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // مسجَّل بالفعل؟ → لوحة الطالب
  useEffect(() => {
    if (user && !loading) router.push("/dashboard");
  }, [user, loading, router]);

  if (user && !loading) {
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );
  }

  return (
    <div className="auth-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh" }}>
      <div style={{ display: "flex", flexDirection: "column", padding: "24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "10px", alignSelf: "flex-start" }}>
          <span style={{ width: "38px", height: "38px", borderRadius: "11px", background: "linear-gradient(150deg,var(--navy-700),var(--navy-900))", display: "grid", placeItems: "center" }}>
            <span className="serif" style={{ color: "var(--gold-400)", fontSize: "20px", fontWeight: 700, lineHeight: 1 }}>م</span>
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--ink-2)", fontSize: "14px", fontWeight: 700 }}><Icon name="chevR" size={15} /> العودة للرئيسية</span>
        </Link>
        <div style={{ flexGrow: 1, display: "grid", placeItems: "center", padding: "32px 0" }}>
          <div style={{ width: "100%", maxWidth: "440px" }}>{children}</div>
        </div>
      </div>
      <div className="auth-aside" style={{ background: "linear-gradient(160deg,var(--navy-700),var(--navy-900))", position: "relative", overflow: "hidden", display: "grid", placeItems: "center", padding: "56px" }}>
        <Ornament size={240} color="rgba(191,145,64,.10)" style={{ position: "absolute", top: "-60px", insetInlineStart: "-50px" }} />
        <Ornament size={180} color="rgba(191,145,64,.07)" style={{ position: "absolute", bottom: "-40px", insetInlineEnd: "-30px" }} />
        <div style={{ position: "relative", color: "#fff", maxWidth: "440px", textAlign: "center" }}>
          <img src="/instructor.png" alt="" style={{ width: 130, height: 130, borderRadius: "50%", objectFit: "cover", objectPosition: "center 18%", border: "4px solid var(--gold-400)", margin: "0 auto 26px", boxShadow: "var(--shadow-lg)" }} />
          <span className="serif" style={{ fontSize: "30px", color: "var(--gold-400)", display: "block", marginBottom: "16px" }}>﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾</span>
          <h2 style={{ color: "#fff", fontSize: "26px", marginBottom: "14px", lineHeight: 1.4 }}>{mode === "register" ? "انضمّ إلى آلاف الطلاب اليوم" : "أهلاً بعودتك من جديد"}</h2>
          <p style={{ color: "#c5d2dd", fontSize: "16px", lineHeight: 1.85 }}>{mode === "register" ? "أنشئ حسابك مجاناً وابدأ رحلتك في تعلّم العربية والقرآن مع معلّمٍ أزهري موثوق." : "سجّل الدخول لمتابعة دروسك ومواصلة تقدّمك من حيث توقّفت."}</p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", marginTop: "34px", flexWrap: "wrap" }}>
            {([["٨٥٠+", "طالب"], ["٦٤٠+", "درس"], ["٪٩٨", "رضا"]] as const).map(([v, l]) => (
              <div key={l} style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: "14px", padding: "14px 22px" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "var(--gold-400)" }}>{v}</div>
                <div style={{ fontSize: "12.5px", color: "#9fb0bf" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
