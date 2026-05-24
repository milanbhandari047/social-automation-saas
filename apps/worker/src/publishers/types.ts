export type Platform = "FACEBOOK" | "INSTAGRAM" | "TIKTOK";

export type PublishPayload = {
  platform: Platform;
  content: string;
  accessToken: string;
  accountId: string;
  mediaUrls?: string[];
};
