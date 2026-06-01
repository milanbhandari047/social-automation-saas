import { publishInstagramPost } from "src/services/instagram.service";
import { PublishPayload } from "./types";

export const publishToInstagram = async (payload: PublishPayload) => {
  if (!payload.igUserId || !payload.accessToken) {
    throw new Error("igUserId and accessToken are required for Instagram");
  }

  try {
    const result = await publishInstagramPost({
      content: payload.content,
      mediaUrl: payload.mediaUrl,
      igUserId: payload.igUserId,
      accessToken: payload.accessToken,
    });
    return result;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error?.message || "Instagram publish failed"
    );
  }
};
