import React from "react";
import { colors } from "@/constants/auth/styles";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)`,
          pointerEvents: "none",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          margin: "0 16px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        input::placeholder { color: var(--text-faint); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px var(--surface) inset !important;
          -webkit-text-fill-color: var(--text) !important;
        }
      `}</style>
    </div>
  );
}
