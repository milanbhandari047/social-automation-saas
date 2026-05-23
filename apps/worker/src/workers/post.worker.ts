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
     * PUBLISH TO EACH TARGET PLATFORM
     */
    for (const target of post.targets) {
      const platform = target.socialAccount.platform;

      try {
        console.log(`📤 Posting to ${platform}...`);

        if (platform === "FACEBOOK") {
          await publishToFacebook(post.content);
        }

        if (platform === "INSTAGRAM") {
          console.log("Instagram integration coming next");
        }

        if (platform === "TIKTOK") {
          console.log("TikTok integration coming next");
        }

        await prisma.postTarget.update({
          where: { id: target.id },
          data: {
            status: "PUBLISHED",
            publishedAt: new Date(),
          },
        });

        console.log(`✅ Successfully posted to ${platform}`);
      } catch (err) {
        console.error(`❌ Failed to post to ${platform}:`, err);

        await prisma.postTarget.update({
          where: { id: target.id },
          data: {
            status: "FAILED",
            errorMessage: String(err),
          },
        });
      }
    }

    /**
     * UPDATE OVERALL POST STATUS
     */
    const targets = await prisma.postTarget.findMany({
      where: { postId },
    });

    const allPublished = targets.every((t: any) => t.status === "PUBLISHED");
    const allFailed = targets.every((t: any) => t.status === "FAILED");

    await prisma.post.update({
      where: { id: postId },
      data: {
        status: allPublished ? "PUBLISHED" : allFailed ? "FAILED" : "PARTIAL",
      },
    });

    console.log("✅ Job processing complete");
  },
  { connection }
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
