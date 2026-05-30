import { useMemo } from "react";
import { PasswordStrength } from "@/types/auth.types";

export function usePasswordStrength(password: string): PasswordStrength {
  return useMemo(() => {
    if (password.length === 0) return { score: 0, label: "", color: "" };

    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { score, label: "Good", color: "#eab308" };
    return { score, label: "Strong", color: "#22c55e" };
  }, [password]);
}
