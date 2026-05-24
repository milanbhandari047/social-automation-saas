import { PublishPayload } from "./types";

export const publishToTikTok = async (payload: PublishPayload) => {
  console.log("🎵 TikTok publishing placeholder");

  return {
    success: true,
    platform: "tiktok",
  };
};
