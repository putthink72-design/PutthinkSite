"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const PENDING_LIKE_KEY = "putthink_pending_like";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  /** Open login only when a gated action needs it */
  requestLogin: (opts?: { pendingLikeId?: string }) => void;
  closeLogin: () => void;
  loginOpen: boolean;
  signInWith: (provider: "apple" | "google") => Promise<void>;
  signOut: () => Promise<void>;
  /** Set after OAuth return; card that matches should like then clear */
  pendingLikeId: string | null;
  clearPendingLike: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function hasEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = hasEnv();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(configured);
  const [loginOpen, setLoginOpen] = useState(false);
  const [pendingLikeId, setPendingLikeId] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
      if (data.session?.user) {
        try {
          const id = sessionStorage.getItem(PENDING_LIKE_KEY);
          if (id) {
            sessionStorage.removeItem(PENDING_LIKE_KEY);
            setPendingLikeId(id);
          }
        } catch {
          /* ignore */
        }
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
      setLoading(false);
      if (next?.user) {
        setLoginOpen(false);
        if (event === "SIGNED_IN") {
          try {
            const id = sessionStorage.getItem(PENDING_LIKE_KEY);
            if (id) {
              sessionStorage.removeItem(PENDING_LIKE_KEY);
              setPendingLikeId(id);
            }
          } catch {
            /* ignore */
          }
        }
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [configured]);

  const requestLogin = useCallback((opts?: { pendingLikeId?: string }) => {
    if (opts?.pendingLikeId) {
      try {
        sessionStorage.setItem(PENDING_LIKE_KEY, opts.pendingLikeId);
      } catch {
        /* ignore */
      }
    }
    setLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => setLoginOpen(false), []);
  const clearPendingLike = useCallback(() => setPendingLikeId(null), []);

  const signInWith = useCallback(
    async (provider: "apple" | "google") => {
      if (!configured) return;
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        window.location.pathname + window.location.search,
      )}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) throw error;
    },
    [configured],
  );

  const signOut = useCallback(async () => {
    if (!configured) return;
    const supabase = createClient();
    await supabase.auth.signOut();
  }, [configured]);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      configured,
      requestLogin,
      closeLogin,
      loginOpen,
      signInWith,
      signOut,
      pendingLikeId,
      clearPendingLike,
    }),
    [
      user,
      session,
      loading,
      configured,
      requestLogin,
      closeLogin,
      loginOpen,
      signInWith,
      signOut,
      pendingLikeId,
      clearPendingLike,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
