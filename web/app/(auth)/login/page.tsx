import type { Metadata } from "next";
import LoginClient from "./login-client";

export const metadata: Metadata = { title: "تسجيل الدخول" };

export default function LoginPage() {
  return <LoginClient />;
}
