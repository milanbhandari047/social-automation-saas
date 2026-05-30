import { Platform } from "@/types/dashboard.types";
import {
  colors,
  radius,
  typography,
  transition,
  cardStyle,
  sectionLabelStyle,
  ghostButtonStyle,
} from "@/constants/tokens";

interface ConnectedAccountsProps {
  platforms: Platform[];
  connectedCount?: number;
}

export function ConnectedAccounts({
  platforms,
  connectedCount = 0,
}: ConnectedAccountsProps) {
  return (
    <div style={{ ...cardStyle, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "4px",
        }}
      >
        <h2 style={sectionLabelStyle}>Connected Accounts</h2>

        <span
          style={{
            fontSize: typography.size.xs,
            padding: "2px 8px",
            background: colors.accentGlow,
            border: `1px solid ${colors.accentBorder}`,
            borderRadius: radius.sm,
            color: colors.accentText,
            fontWeight: typography.weight.bold,
            letterSpacing: typography.tracking.wider,
          }}
        >
          {connectedCount} / {platforms.length}
        </span>
      </div>

      {/* Subtitle */}
      <p
        style={{
          margin: "4px 0 16px",
          fontSize: typography.size.base,
          color: colors.textMuted, // ← was #2a2a2a (invisible)
        }}
      >
        Connect your social accounts to start posting
      </p>

      {/* Platform rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
        }}
      >
        {platforms.map(({ name, Icon, color }) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: radius.lg,
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${colors.border}`,
              cursor: "pointer",
              transition: transition.fast,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = colors.borderStrong)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = colors.border)
            }
          >
            {/* Platform icon */}
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: radius.md,
                background: color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon />
            </div>

            {/* Name */}
            <span
              style={{
                flex: 1,
                fontSize: typography.size.base,
                color: colors.textSecondary, // ← was #888 (low contrast)
                fontWeight: typography.weight.medium,
              }}
            >
              {name}
            </span>

            {/* Connect button */}
            <button
              style={ghostButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = color + "15";
                e.currentTarget.style.color = color;
                e.currentTarget.style.borderColor = color + "40";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = colors.textSecondary;
                e.currentTarget.style.borderColor = colors.border;
              }}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
