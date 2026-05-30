import { publishTikTokPost } from "../services/tiktok.service";
import { PublishPayload } from "./types";

export const publishToTikTok = async (payload: PublishPayload) => {
  try {
    return await publishTikTokPost(payload);
  } catch (error: any) {
    throw new Error(error?.message || "TikTok publish failed");
  }
};
