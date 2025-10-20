"use client";

import { useAuth } from "@/context/AuthContext.jsx";
import Loader from "./Loader.jsx";

export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (user === undefined) return <Loader />;
  return <>{children}</>;
}

export function RequireRole({ role, children }) {
  const { role: currentRole } = useAuth();
  if (!currentRole) return <Loader />;
  if (role === "ADMIN" && currentRole !== "ADMIN") return null;
  return <>{children}</>;
}
