import { prisma } from "@repo/db";
import { publishPost } from "../publishers";

/**
 * 🚀 PROCESS POST JOB (BULLMQ WORKER CORE LOGIC)
 */
export const processPost = async (job: any) => {
  console.log("🚀 Processing Job:", job.name);

  const { postId } = job.data;

  /**
   * 📌 FETCH POST WITH TARGETS
   */
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

  if (!post) {
    throw new Error("Post not found");
  }

  let hasFailure = false;
  let hasSuccess = false;

  /**
   * 🔁 LOOP THROUGH ALL TARGETS (MULTI-PLATFORM)
   */
  for (const target of post.targets) {
    try {
      console.log(`📤 Publishing to ${target.socialAccount.platform}...`);

      /**
       * 🚀 UNIVERSAL PUBLISH ENGINE
       */
      await publishPost({
        platform: target.socialAccount.platform,
        content: post.content,
        accessToken: target.socialAccount.accessToken,
        accountId: target.socialAccount.accountId!,
        mediaUrl: post.mediaUrl,
      });

      /**
       * ✅ SUCCESS UPDATE
       */
      await prisma.postTarget.update({
        where: { id: target.id },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          errorMessage: null,
        },
      });

      hasSuccess = true;

      console.log(`✅ Successfully posted to ${target.socialAccount.platform}`);
    } catch (error: any) {
      hasFailure = true;

      console.log(`❌ Failed posting to ${target.socialAccount.platform}`);

      /**
       * ❌ FAILURE + RETRY TRACKING (IMPORTANT FOR PHASE 8)
       */
      await prisma.postTarget.update({
        where: { id: target.id },
        data: {
          status: "FAILED",
          errorMessage: error.message || "Unknown error",

          // 🔥 IMPORTANT FIX: retry tracking
          retryCount: {
            increment: 1,
          },
        },
      });

      /**
       * 🔥 THROW ERROR TO TRIGGER BULLMQ RETRY
       */
      throw error;
    }
  }

  /**
   * 📊 FINAL POST STATUS CALCULATION
   */
  let finalStatus: any = "DRAFT";

  if (hasSuccess && !hasFailure) {
    finalStatus = "PUBLISHED";
  }

  if (hasFailure && hasSuccess) {
    finalStatus = "PARTIAL";
  }

  if (hasFailure && !hasSuccess) {
    finalStatus = "FAILED";
  }

  /**
   * 🧾 UPDATE POST STATUS
   */
  await prisma.post.update({
    where: { id: postId },
    data: {
      status: finalStatus,
    },
  });

  console.log("🎯 Job processing complete");
};
