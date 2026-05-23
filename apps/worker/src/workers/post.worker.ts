import { Worker } from "bullmq";
import IORedis from "ioredis";
import { prisma } from "@repo/db";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "postQueue",
  async (job) => {
    console.log("🚀 Processing Job:", job.name);

    const { postId } = job.data;

    console.log("📌 Post ID:", postId);

    /**
     * FIND POST
     */
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Post not found");
    }

    /**
     * SIMULATE SOCIAL MEDIA PUBLISHING
     */
    console.log("📤 Publishing post...");
    console.log(post.content);

    /**
     * UPDATE STATUS
     */
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        status: "PUBLISHED",
      },
    });

    console.log("✅ Post published successfully");
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job failed: ${job?.id}`);
  console.log(err);
});

console.log("🚀 Post worker started...");
