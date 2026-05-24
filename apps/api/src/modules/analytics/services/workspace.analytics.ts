import { prisma } from "@repo/db";
import { Post } from "@prisma/client";

export const getWorkspaceAnalytics = async (workspaceId: string) => {
  const posts: Post[] = await prisma.post.findMany({
    where: { workspaceId },
  });

  const totalPosts = posts.length;

  const publishedPosts = posts.filter(
    (p: Post) => p.status === "PUBLISHED"
  ).length;

  const failedPosts = posts.filter((p: Post) => p.status === "FAILED").length;

  const scheduledPosts = posts.filter(
    (p: Post) => p.status === "SCHEDULED"
  ).length;

  return {
    totalPosts,
    publishedPosts,
    failedPosts,
    scheduledPosts,
    successRate: totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0,
  };
};
