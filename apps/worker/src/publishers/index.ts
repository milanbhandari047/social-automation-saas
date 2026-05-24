import { publishToFacebook } from "./facebook.publisher";
import { publishToInstagram } from "./instagram.publisher";
import { publishToTikTok } from "./tiktok.publisher";

export const publishPost = async ({
  platform,
  content,
  accessToken,
  accountId,
}: {
  platform: string;
  content: string;
  accessToken: string;
  accountId: string;
}) => {
  switch (platform) {
    case "FACEBOOK":
      return publishToFacebook(content, accessToken, accountId);

    case "INSTAGRAM":
      return publishToInstagram();

    case "TIKTOK":
      return publishToTikTok();

    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
};
