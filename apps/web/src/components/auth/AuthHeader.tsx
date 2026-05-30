import React from "react";
import { colors } from "@/constants/auth/styles";

interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthHeader({ icon, title, subtitle }: AuthHeaderProps) {
  return (
    <div style={{ marginBottom: "40px", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-xl)",
          background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
          marginBottom: "24px",
          boxShadow: `0 0 40px var(--accent-shadow)`,
        }}
      >
        {icon}
      </div>

      <h1
        style={{
          fontSize: "28px",
          fontWeight: "400",
          color: colors.text,
          margin: "0 0 8px",
          letterSpacing: "-0.5px",
        }}
      >
        {title}
      </h1>

      <p style={{ fontSize: "14px", color: colors.textDim, margin: 0 }}>
        {subtitle}
      </p>
    </div>
  );
}
