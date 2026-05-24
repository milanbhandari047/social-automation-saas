import { prisma } from "@repo/db";

export const getFailureInsights = async (workspaceId: string) => {
  const targets = await prisma.postTarget.findMany({
    where: {
      post: {
        workspaceId,
      },
    },
  });

  const errorMap: Record<string, number> = {};
  let totalRetries = 0;

  for (const t of targets) {
    if (t.errorMessage) {
      errorMap[t.errorMessage] = (errorMap[t.errorMessage] || 0) + 1;
    }

    totalRetries += t.retryCount;
  }

  return {
    errorBreakdown: errorMap,
    totalRetries,
    averageRetries: targets.length > 0 ? totalRetries / targets.length : 0,
  };
};
