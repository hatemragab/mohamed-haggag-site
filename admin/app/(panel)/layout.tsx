"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/components/auth-context";
import { AdminShell } from "@/components/shell";

/** Client guard: only admins see the panel; the API enforces it server-side too. */
export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !admin) router.replace("/login");
  }, [loading, admin, router]);

  if (loading || !admin)
    return (
      <div className="boot">
        <div className="ring" />
      </div>
    );

  return <AdminShell>{children}</AdminShell>;
}
