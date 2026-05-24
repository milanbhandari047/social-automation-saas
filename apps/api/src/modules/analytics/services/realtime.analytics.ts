import { prisma } from "@repo/db";

export const getRealtimeMetrics = async (workspaceId: string) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const posts = await prisma.post.findMany({
    where: {
      workspaceId,
      createdAt: {
        gte: last24h,
      },
    },
  });

  const postsPerHour = Array(24).fill(0);

  for (const post of posts) {
    const hour = new Date(post.createdAt).getHours();
    postsPerHour[hour]++;
  }

  return {
    totalLast24h: posts.length,
    postsPerHour,
  };
};
