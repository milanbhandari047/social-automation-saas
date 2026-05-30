import axios from "axios";
import { PublishPayload } from "src/publishers/types";

const IG_USER_ID = process.env.IG_USER_ID!;
const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN!;
const GRAPH_URL = "https://graph.facebook.com/v19.0";

/**
 * Step 1: Create media container
 * Step 2: Publish container
 */
export const publishInstagramPost = async (payload: PublishPayload) => {
  const { content, mediaUrl } = payload;

  if (!mediaUrl) {
    throw new Error("Instagram requires mediaUrl (image/video)");
  }

  try {
    // 1️⃣ Create media container
    const containerRes = await axios.post(
      `${GRAPH_URL}/${IG_USER_ID}/media`,
      null,
      {
        params: {
          image_url: mediaUrl,
          caption: content || "",
          access_token: ACCESS_TOKEN,
        },
      }
    );

    const creationId = containerRes.data.id;

    // 2️⃣ Publish media container
    const publishRes = await axios.post(
      `${GRAPH_URL}/${IG_USER_ID}/media_publish`,
      null,
      {
        params: {
          creation_id: creationId,
          access_token: ACCESS_TOKEN,
        },
      }
    );

    return {
      success: true,
      platform: "INSTAGRAM",
      id: publishRes.data.id,
    };
  } catch (error: any) {
    throw error;
  }
};
