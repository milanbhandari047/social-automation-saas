import { QuickAction } from "@/types/dashboard.types";
import {
  colors,
  radius,
  typography,
  transition,
  cardStyle,
  sectionLabelStyle,
  badgeStyle,
} from "@/constants/tokens";

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div style={cardStyle}>
      <h2 style={{ ...sectionLabelStyle, marginBottom: "16px" }}>
        Quick Actions
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: radius.lg,
                border: `1px solid ${action.border}`,
                background: action.bg,
                cursor: "pointer",
                transition: transition.fast,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateX(3px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateX(0)")
              }
            >
              {/* Icon box */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: radius.md,
                  background: action.bg,
                  border: `1px solid ${action.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} color={action.accent} strokeWidth={1.8} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.base,
                    color: colors.text, // ← was #d0d0d0 (ok but unify)
                    fontWeight: typography.weight.semibold,
                  }}
                >
                  {action.label}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: typography.size.sm,
                    color: colors.textMuted, // ← was #737373 (fine, now token)
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {action.desc}
                </p>
              </div>

              {/* Tag badge */}
              <span style={badgeStyle}>{action.tag}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
