import { prisma } from "@repo/db";
import { publishPost } from "../publishers";

export const processPost = async (job: any) => {
  console.log("🚀 Processing Job:", job.name);

  const { postId } = job.data;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      targets: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  if (!post) throw new Error("Post not found");

  let hasFailure = false;
  let hasSuccess = false;

  for (const target of post.targets) {
    try {
      await publishPost({
        platform: target.socialAccount.platform,
        content: post.content,
        accessToken: target.socialAccount.accessToken,
        accountId: target.socialAccount.accountId!,
      });

      await prisma.postTarget.update({
        where: { id: target.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          errorMessage: null,
        },
      });

      hasSuccess = true;
    } catch (error: any) {
      hasFailure = true;

      await prisma.postTarget.update({
        where: { id: target.id },
        data: {
          status: "FAILED",
          errorMessage: error.message || "Unknown error",
        },
      });

      throw error; // keeps BullMQ retry working
    }
  }

  let finalStatus: any = "DRAFT";

  if (hasSuccess && !hasFailure) finalStatus = "PUBLISHED";
  if (hasFailure) finalStatus = "FAILED";

  await prisma.post.update({
    where: { id: postId },
    data: { status: finalStatus },
  });

  console.log("✅ Job processing complete");
};
