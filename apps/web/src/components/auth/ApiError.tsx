import React from "react";
import { colors } from "@/constants/auth/styles";

interface ApiErrorProps {
  message: string;
}

export function ApiError({ message }: ApiErrorProps) {
  if (!message) return null;

  return (
    <div
      style={{
        padding: "12px 14px",
        background: colors.errorBg,
        border: `1px solid ${colors.errorBorder}`,
        borderRadius: "var(--radius-md)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke={colors.error}
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span style={{ fontSize: "13px", color: colors.error }}>{message}</span>
    </div>
  );
}
