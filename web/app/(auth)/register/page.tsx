import type { Metadata } from "next";
import RegisterClient from "./register-client";

export const metadata: Metadata = { title: "إنشاء حساب" };

export default function RegisterPage() {
  return <RegisterClient />;
}
