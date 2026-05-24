import { prisma } from "@repo/db";

type PlatformKey = "FACEBOOK" | "INSTAGRAM" | "TIKTOK";

export const getPlatformBreakdown = async (workspaceId: string) => {
  const posts = await prisma.post.findMany({
    where: { workspaceId },
    include: {
      targets: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  const result: Record<PlatformKey, { total: number; success: number }> = {
    FACEBOOK: { total: 0, success: 0 },
    INSTAGRAM: { total: 0, success: 0 },
    TIKTOK: { total: 0, success: 0 },
  };

  for (const post of posts) {
    for (const target of post.targets) {
      const platform = target.socialAccount.platform as PlatformKey;

      result[platform].total++;

      if (target.status === "PUBLISHED") {
        result[platform].success++;
      }
    }
  }

  return result;
};
