import { GrowthTip } from "@/types/dashboard.types";
import {
  colors,
  radius,
  typography,
  cardStyle,
  sectionLabelStyle,
} from "@/constants/tokens";

interface GrowthTipsProps {
  tips: GrowthTip[];
}

export function GrowthTips({ tips }: GrowthTipsProps) {
  return (
    <div style={cardStyle}>
      <h2 style={{ ...sectionLabelStyle, marginBottom: "14px" }}>
        Growth Tips
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tips.map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.text}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "12px 14px",
                borderRadius: radius.lg,
                background: "rgba(255,255,255,0.015)",
                border: `1px solid ${colors.border}`,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: radius.md,
                  background: tip.color + "18",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                <Icon size={13} color={tip.color} strokeWidth={2} />
              </div>

              {/* Tip text */}
              <p
                style={{
                  margin: 0,
                  fontSize: typography.size.base,
                  color: colors.textSecondary, // ← was #606060 (too dim)
                  lineHeight: "1.6",
                }}
              >
                {tip.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
