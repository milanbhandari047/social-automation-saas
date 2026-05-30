"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  WelcomeBanner,
  StatsGrid,
  QuickActions,
  ConnectedAccounts,
  GrowthTips,
  ActivityEmpty,
  PLATFORMS,
} from "@/components/dashboard";
import {
  STATS,
  QUICK_ACTIONS,
  GROWTH_TIPS,
} from "@/constants/dashboard.constants";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        color: "#fafafa",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <WelcomeBanner name={user?.name?.split(" ")[0]} />

      <StatsGrid stats={STATS} />

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}
      >
        <QuickActions actions={QUICK_ACTIONS} />
        <ConnectedAccounts platforms={PLATFORMS} />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px" }}
      >
        <GrowthTips tips={GROWTH_TIPS} />
        <ActivityEmpty />
      </div>
    </div>
  );
}
