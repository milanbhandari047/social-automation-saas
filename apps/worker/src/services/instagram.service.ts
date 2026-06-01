import axios from "axios";

const GRAPH_URL = "https://graph.facebook.com/v19.0";

/**
 * PUBLISH INSTAGRAM POST
 * Uses the access token stored in DB (page token from OAuth)
 */
export const publishInstagramPost = async (payload: {
  content: string;
  mediaUrl?: string;
  igUserId: string; // Instagram Business Account ID (accountId from DB)
  accessToken: string; // Page access token stored in DB
}) => {
  const { content, mediaUrl, igUserId, accessToken } = payload;

  if (!mediaUrl) {
    throw new Error("Instagram requires a mediaUrl (image or video)");
  }

  // Step 1 — create media container
  const containerRes = await axios.post(
    `${GRAPH_URL}/${igUserId}/media`,
    null,
    {
      params: {
        image_url: mediaUrl,
        caption: content || "",
        access_token: accessToken,
      },
    }
  );

  const creationId = containerRes.data.id;

  // Step 2 — publish container
  const publishRes = await axios.post(
    `${GRAPH_URL}/${igUserId}/media_publish`,
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
    platform: "INSTAGRAM",
    id: publishRes.data.id,
  };
};
