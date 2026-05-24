export type Platform = "FACEBOOK" | "INSTAGRAM" | "TIKTOK";

export interface PublishPayload {
  platform: string;
  content: string;
  accessToken: string;
  accountId: string;

  mediaUrl?: string | null;
}
