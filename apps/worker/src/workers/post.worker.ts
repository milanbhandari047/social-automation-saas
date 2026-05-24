import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processPost } from "../processors/post.processor";
import { dlq } from "../queue/dlq.queue";

/**
 * 🔌 REDIS CONNECTION
 */
const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

/**
 * 🚀 BULLMQ WORKER
 * Only responsible for consuming jobs and delegating processing
 */
export const worker = new Worker(
  "postQueue",
  async (job) => {
    console.log("🚀 Processing Job:", job.id);
    console.log("📦 Job Name:", job.name);
    console.log(`🔁 Attempt: ${job.attemptsMade + 1}`);

    return await processPost(job);
  },
  {
    connection,
  }
);

/**
 * ✅ JOB SUCCESS EVENT
 */
worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job?.id}`);
});

/**
 * ❌ JOB FAILED EVENT (DLQ HANDLING)
 */
worker.on("failed", async (job, err) => {
  console.log(`❌ Job failed: ${job?.id}`);
  console.log("Error:", err.message);

  if (!job) return;

  await dlq.add("failed-post", {
    jobId: job.id,
    name: job.name,
    data: job.data,
    error: err.message,
    attemptsMade: job.attemptsMade,
    failedAt: new Date(),
  });
});

/**
 * 📡 WORKER START LOG
 */
console.log("🚀 Post worker started...");
