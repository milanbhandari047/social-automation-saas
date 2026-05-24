import { publishToFacebook } from "./facebook.publisher";
import { publishToInstagram } from "./instagram.publisher";
import { publishToTikTok } from "./tiktok.publisher";

import { PublishPayload } from "./types";

export const publishPost = async (payload: PublishPayload) => {
  switch (payload.platform) {
    case "FACEBOOK":
      return publishToFacebook(payload);

    case "INSTAGRAM":
      return publishToInstagram(payload);

    case "TIKTOK":
      return publishToTikTok(payload);

    default:
      throw new Error(`Unsupported platform: ${payload.platform}`);
  }
};
