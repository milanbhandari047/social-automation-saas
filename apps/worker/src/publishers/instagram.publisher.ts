import axios from "axios";
import { PublishPayload } from "./types";

export const publishToInstagram = async (payload: PublishPayload) => {
  const { content, accessToken, accountId, mediaUrls } = payload;

  if (!mediaUrls || mediaUrls.length === 0) {
    throw new Error("Instagram requires at least one media URL");
  }

  try {
    // STEP 1: Create media container
    const containerRes = await axios.post(
      `https://graph.facebook.com/v19.0/${accountId}/media`,
      null,
      {
        params: {
          image_url: mediaUrls[0],
          caption: content,
          access_token: accessToken,
        },
      }
    );

    const creationId = containerRes.data.id;

    // STEP 2: Publish media
    const publishRes = await axios.post(
      `https://graph.facebook.com/v19.0/${accountId}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: accessToken,
        },
      }
    );

    return {
      success: true,
      platform: "instagram",
      data: publishRes.data,
    };
  } catch (error: any) {
    console.error("Instagram publish failed:", error.response?.data || error);
    throw error;
  }
};
