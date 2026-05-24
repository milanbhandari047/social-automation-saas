import { getWorkspaceAnalytics } from "./services/workspace.analytics";
import { getPlatformBreakdown } from "./services/platform.analytics";
import { getRealtimeMetrics } from "./services/realtime.analytics";
import { getFailureInsights } from "./services/failure.analytics";

export const getFullAnalytics = async (workspaceId: string) => {
  const [basic, platform, realtime, failures] = await Promise.all([
    getWorkspaceAnalytics(workspaceId),
    getPlatformBreakdown(workspaceId),
    getRealtimeMetrics(workspaceId),
    getFailureInsights(workspaceId),
  ]);

  return {
    basic,
    platform,
    realtime,
    failures,
  };
};
