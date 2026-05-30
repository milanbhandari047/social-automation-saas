import { Plus } from "lucide-react";
import {
  colors,
  radius,
  typography,
  shadows,
  transition,
  primaryButtonStyle,
} from "@/constants/tokens";

interface WelcomeBannerProps {
  name?: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  return (
    <div
      style={{
        padding: "24px 28px",
        background: "linear-gradient(135deg, #111 0%, #0d0d0d 100%)",
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: radius["2xl"],
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div>
        {/* "WELCOME BACK" label */}
        <p
          style={{
            margin: "0 0 4px",
            fontSize: typography.size.sm,
            color: colors.textFaint, // ← was #3a3a3a (invisible)
            fontWeight: typography.weight.semibold,
            letterSpacing: typography.tracking.widest,
            textTransform: "uppercase",
          }}
        >
          Welcome back
        </p>

        {/* Name heading */}
        <h1
          style={{
            margin: "0 0 6px",
            fontSize: typography.size["3xl"],
            fontWeight: typography.weight.bold,
            letterSpacing: typography.tracking.tight,
            color: colors.text,
            lineHeight: 1.2,
          }}
        >
          {name || "Creator"} <span style={{ color: colors.accent }}>👋</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.textMuted, // ← was #3a3a3a (invisible)
          }}
        >
          Your social automation hub is ready. Let's start posting.
        </p>
      </div>

      {/* CTA button */}
      <button
        style={primaryButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = shadows.accentMd;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = shadows.accentSm;
        }}
      >
        <Plus size={15} strokeWidth={3} />
        Create Post
      </button>
    </div>
  );
}
