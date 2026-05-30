import React from "react";
import { colors } from "@/constants/auth/styles";

interface FieldErrorProps {
  msg?: string;
}

export function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null;

  return (
    <p
      style={{
        margin: "6px 0 0",
        fontSize: "12px",
        color: colors.error,
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {msg}
    </p>
  );
}
