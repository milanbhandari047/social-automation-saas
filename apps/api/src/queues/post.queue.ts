import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const postQueue = new Queue("postQueue", {
  connection,
  defaultJobOptions: {
    attempts: 5, // 🔥 retry 5 times

    backoff: {
      type: "exponential",
      delay: 5000, // 5 sec → 10 → 20 → 40 ...
    },

    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
