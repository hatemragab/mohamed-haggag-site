"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiGet, apiPost } from "@/lib/client";
import type { AuthUser, MeSummary } from "@/lib/types";

interface AuthCtx {
  user: AuthUser | null;
  summary: MeSummary | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  isUnlocked: (categoryId: string) => boolean;
  isDone: (lessonId: string) => boolean;
  toggleDone: (lessonId: string) => Promise<void>;
  pushContinue: (lessonId: string) => Promise<void>;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<MeSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = useCallback(async () => {
    try {
      const me = await apiGet<AuthUser>("/auth/me");
      setUser(me);
      setSummary(await apiGet<MeSummary>("/me/summary"));
    } catch {
      setUser(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Session bootstrap: state updates happen only after awaited API calls,
    // not synchronously — the lint rule can't see through the async boundary.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadSession();
  }, [loadSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      await apiPost<AuthUser>("/auth/login", { email, password });
      await loadSession();
    },
    [loadSession],
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      await apiPost<AuthUser>("/auth/register", data);
      await loadSession();
    },
    [loadSession],
  );

  const logout = useCallback(async () => {
    try {
      await apiPost("/auth/logout");
    } finally {
      setUser(null);
      setSummary(null);
    }
  }, []);

  const isUnlocked = useCallback(
    (categoryId: string) =>
      !!user &&
      (user.role === "admin" ||
        (summary?.unlockedAll ?? user.unlockedAll) ||
        (summary?.unlockedCategories ?? user.unlockedCategories).includes(
          categoryId,
        )),
    [user, summary],
  );

  const isDone = useCallback(
    (lessonId: string) => summary?.progress.includes(lessonId) ?? false,
    [summary],
  );

  const toggleDone = useCallback(async (lessonId: string) => {
    const res = await apiPost<{ lessonId: string; done: boolean }>(
      `/me/progress/${lessonId}`,
    );
    setSummary((s) =>
      s
        ? {
            ...s,
            progress: res.done
              ? [...s.progress, lessonId]
              : s.progress.filter((p) => p !== lessonId),
          }
        : s,
    );
  }, []);

  const pushContinue = useCallback(
    async (lessonId: string) => {
      try {
        await apiPost("/me/continue", { lessonId });
        setSummary(await apiGet<MeSummary>("/me/summary"));
      } catch {
        /* non-fatal: continue-watching is best-effort */
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        summary,
        loading,
        login,
        register,
        logout,
        refresh: loadSession,
        isUnlocked,
        isDone,
        toggleDone,
        pushContinue,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
