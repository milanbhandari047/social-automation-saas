"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMe } from "@/services/auth.service";
import { useAuthStore } from "./auth.store";

const PUBLIC_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Don't fetch /me on public routes — no token exists yet
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  return <>{children}</>;
}
