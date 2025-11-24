"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthStorage, UserAPI } from "@/services/api";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

const PUBLIC_ROUTES = new Set([
  "/",
  "/main-page",
  "/main-page/",
  "/login",
  "/reset-password",
  "/recover-password",
]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(AuthStorage.roleStore.get() || null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = AuthStorage.tokenStore.get();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const me = await UserAPI.getMe();
        setUser(me);
      } catch {
        // invalid token
        AuthStorage.tokenStore.clear();
        AuthStorage.roleStore.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    const token = AuthStorage.tokenStore.get();
    const currentRole = AuthStorage.roleStore.get();
    const isPublic = PUBLIC_ROUTES.has(pathname || "/");

    if (!token && !isPublic) {
      router.replace("/main-page");
      return;
    }

    // Role-based guard: /admin/* requires admin, /home and user areas require user or admin
    if (token && pathname?.startsWith("/admin") && currentRole !== "ADMIN") {
      router.replace("/home");
    }
  }, [pathname, loading, router]);

  const value = useMemo(
    () => ({
      user,
      role,
      setRole: (r) => {
        setRole(r);
        AuthStorage.roleStore.set(r);
      },
      setUser,
      signOut: () => {
        AuthStorage.tokenStore.clear();
        AuthStorage.roleStore.clear();
        setUser(null);
        setRole(null);
        router.replace("/main-page");
      },
    }),
    [user, role, router]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
