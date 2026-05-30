import React from "react";
import { colors } from "@/constants/auth/styles";

interface SubmitButtonProps {
  loading: boolean;
  label: string;
  loadingLabel: string;
  onClick: () => void;
}

export function SubmitButton({
  loading,
  label,
  loadingLabel,
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        marginTop: "4px",
        width: "100%",
        padding: "15px",
        background: loading
          ? colors.loadingBg
          : `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
        border: loading ? `1px solid ${colors.loadingBorder}` : "none",
        borderRadius: "var(--radius-lg)",
        color: loading ? colors.loadingText : colors.bg,
        fontSize: "14px",
        fontWeight: "700",
        letterSpacing: "1px",
        textTransform: "uppercase",
        cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: loading ? "none" : `0 4px 24px var(--accent-shadow)`,
      }}
      onMouseEnter={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = `0 8px 32px var(--accent-shadow)`;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = loading
          ? "none"
          : `0 4px 24px var(--accent-shadow)`;
      }}
    >
      {loading ? (
        <>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ animation: "spin 1s linear infinite" }}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          {loadingLabel}
        </>
      ) : (
        label
      )}
    </button>
  );
}
