import { Worker } from "bullmq";
import IORedis from "ioredis";
import { processPost } from "../processors/post.processor";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  "postQueue",
  async (job) => {
    return await processPost(job);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.log(`❌ Job failed: ${job?.id}`, err);
});

console.log("🚀 Post worker started...");
