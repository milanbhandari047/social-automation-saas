import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL, // or local redis url
});

redis.connect().catch((err) => {
  console.error("Redis connection error:", err);
});

redis.on("connect", () => {
  console.log("Redis connected 🚀");
});

export default redis;
