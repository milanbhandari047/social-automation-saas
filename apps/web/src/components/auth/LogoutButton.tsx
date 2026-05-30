"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function LogoutButton() {
  const { clearUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser(); // calls backend → clears refreshToken cookie
    } finally {
      clearUser(); // clears zustand store
      localStorage.removeItem("accessToken"); // belt and suspenders
      router.replace("/login"); // redirect
    }
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
