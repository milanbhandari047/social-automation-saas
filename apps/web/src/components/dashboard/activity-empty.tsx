import { Clock } from "lucide-react";
import { colors, radius, typography, transition } from "@/constants/tokens";

export function ActivityEmpty() {
  return (
    <div
      style={{
        padding: "20px",
        background: "#0d0d0d",
        border: `1px dashed ${colors.borderDash}`,
        borderRadius: radius.xl,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "10px",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: radius.xl,
          background: colors.accentGlow,
          border: `1px solid ${colors.accentBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Clock size={22} color={colors.accent} strokeWidth={1.5} />
      </div>

      {/* Copy */}
      <div>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: typography.size.md,
            fontWeight: typography.weight.semibold,
            color: colors.textSecondary, // ← was #606060 (too dim)
          }}
        >
          No activity yet
        </p>
        <p
          style={{
            margin: 0,
            fontSize: typography.size.base,
            color: colors.textMuted, // ← was #2a2a2a (invisible)
            lineHeight: "1.5",
          }}
        >
          Your post history and
          <br />
          scheduled queue appears here.
        </p>
      </div>

      {/* CTA */}
      <button
        style={{
          marginTop: "4px",
          padding: "9px 18px",
          background: "transparent",
          border: `1px solid ${colors.accentBorder}`,
          borderRadius: radius.md,
          color: colors.accentText,
          fontSize: typography.size.base,
          fontWeight: typography.weight.semibold,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: transition.fast,
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = colors.accentGlow)
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        Create first post →
      </button>
    </div>
  );
}
