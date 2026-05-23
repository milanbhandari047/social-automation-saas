import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@repo/db";

import { publishToFacebook } from "../services/facebook.service";

/**
 * REDIS CONNECTION
 */
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

/**
 * BULLMQ WORKER
 */
export const worker = new Worker(
  "postQueue",
  async (job) => {
    console.log("🚀 Processing Job:", job.name);
    console.log(`🔁 Retry attempt: ${job.attemptsMade + 1}`);

    const { postId } = job.data;

    console.log("📌 Post ID:", postId);

    /**
     * FIND POST
     */
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
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

    /**
     * TRACK RESULT STATES
     */
    let hasFailure = false;
    let hasSuccess = false;

    /**
     * LOOP THROUGH TARGETS
     */
    for (const target of post.targets) {
      const platform = target.socialAccount.platform;

      try {
        console.log(`📤 Posting to ${platform}...`);

        /**
         * FACEBOOK
         */
        if (platform === "FACEBOOK") {
          await publishToFacebook(post.content);
        }

        /**
         * INSTAGRAM
         */
        if (platform === "INSTAGRAM") {
          console.log("📸 Instagram integration coming next");
        }

        /**
         * TIKTOK
         */
        if (platform === "TIKTOK") {
          console.log("🎵 TikTok integration coming next");
        }

        /**
         * UPDATE TARGET SUCCESS
         */
        await prisma.postTarget.update({
          where: {
            id: target.id,
          },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
            errorMessage: null,
          },
        });

        hasSuccess = true;

        console.log(`✅ Successfully posted to ${platform}`);
      } catch (error: any) {
        console.log(`❌ Failed posting to ${platform}`);

        hasFailure = true;

        /**
         * UPDATE TARGET FAILED
         */
        await prisma.postTarget.update({
          where: {
            id: target.id,
          },
          data: {
            status: "FAILED",
            errorMessage: error.message || "Unknown error",
          },
        });

        console.log(error);

        /**
         * THROW ERROR
         * IMPORTANT:
         * This triggers BullMQ retries
         */
        throw error;
      }
    }

    /**
     * UPDATE OVERALL POST STATUS
     */
    let finalStatus: any = "DRAFT";

    if (hasSuccess && !hasFailure) {
      finalStatus = "PUBLISHED";
    }

    if (!hasSuccess && hasFailure) {
      finalStatus = "FAILED";
    }

    if (hasSuccess && hasFailure) {
      finalStatus = "FAILED";
    }

    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: finalStatus,
      },
    });

    console.log("✅ Job processing complete");
  },
  {
    connection,
  }
);

/**
 * EVENTS
 */
worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job failed: ${job?.id}`);
  console.log(err);
});

console.log("🚀 Post worker started...");
