import React from "react";
import { PasswordStrength } from "@/types/auth.types";

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

export function PasswordStrengthMeter({
  strength,
}: PasswordStrengthMeterProps) {
  if (strength.score === 0) return null;

  return (
    <div style={{ marginTop: "8px" }}>
      <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "3px",
              borderRadius: "var(--radius-sm)",
              background:
                i <= strength.score ? strength.color : "var(--border-strong)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: "11px", color: strength.color }}>
        {strength.label} password
      </span>
    </div>
  );
}
