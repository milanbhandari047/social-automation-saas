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

    const { postId } = job.data;

    console.log("📌 Post ID:", postId);

    /**
     * FIND POST
     */
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        workspace: true,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    try {
      /**
       * PUBLISH TO FACEBOOK
       */
      console.log("📤 Publishing to Facebook...");

      await publishToFacebook(post.content);

      /**
       * UPDATE STATUS → PUBLISHED
       */
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "PUBLISHED",
        },
      });

      console.log("✅ Post published successfully");
    } catch (error) {
      console.error("❌ Facebook publish failed:", error);

      /**
       * UPDATE STATUS → FAILED
       */
      await prisma.post.update({
        where: { id: postId },
        data: {
          status: "FAILED",
        },
      });

      throw error;
    }
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
  console.error(`❌ Job failed: ${job?.id}`, err);
});

console.log("🚀 Post worker started...");
