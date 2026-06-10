"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiGet, apiPost } from "@/lib/client";
import type { AuthUser } from "@/lib/types";

interface AdminAuthCtx {
  admin: AuthUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AdminAuthCtx | null>(null);

/** localStorage flag: "this browser logged in before" — gates the silent refresh. */
const SESSION_HINT = "mh_admin_session_hint";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // /auth/me is public and returns null for anonymous visitors (no 401 noise);
    // if the access token expired but we logged in before, try one silent refresh.
    const load = async (): Promise<AuthUser | null> => {
      let { user: me } = await apiGet<{ user: AuthUser | null }>("/auth/me");
      if (!me && localStorage.getItem(SESSION_HINT)) {
        try {
          await apiPost("/auth/refresh");
          ({ user: me } = await apiGet<{ user: AuthUser | null }>("/auth/me"));
        } catch {
          localStorage.removeItem(SESSION_HINT);
        }
      }
      return me;
    };
    load()
      .then((u) => setAdmin(u?.role === "admin" ? u : null))
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const u = await apiPost<AuthUser>("/auth/admin/login", {
      identifier,
      password,
    });
    localStorage.setItem(SESSION_HINT, "1");
    setAdmin(u);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiPost("/auth/logout");
    } finally {
      localStorage.removeItem(SESSION_HINT);
      setAdmin(null);
    }
  }, []);

  return (
    <Ctx.Provider value={{ admin, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth(): AdminAuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useAdminAuth must be used inside <AdminAuthProvider>");
  return ctx;
}
