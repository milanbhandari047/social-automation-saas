import { StatCard } from "@/types/dashboard.types";
import {
  colors,
  radius,
  typography,
  transition,
  cardStyle,
} from "@/constants/tokens";

interface StatsGridProps {
  stats: StatCard[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",
      }}
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            style={{
              ...cardStyle,
              transition: transition.base,
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.borderStrong;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Label + icon row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: typography.size.sm,
                  color: colors.textMuted, // ← was #3a3a3a (invisible)
                  fontWeight: typography.weight.semibold,
                  letterSpacing: typography.tracking.wide,
                }}
              >
                {stat.label}
              </span>

              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: radius.md,
                  background: stat.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={15} color={stat.accent} strokeWidth={1.8} />
              </div>
            </div>

            {/* Value */}
            <p
              style={{
                margin: "0 0 4px",
                fontSize: typography.size["4xl"],
                fontWeight: typography.weight.bold,
                letterSpacing: "-1.5px",
                color: colors.text,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </p>

            {/* Sub label */}
            <p
              style={{
                margin: 0,
                fontSize: typography.size.sm,
                color: colors.textMuted, // ← was #2a2a2a (invisible)
              }}
            >
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
