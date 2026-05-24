import axios from "axios";
import { PublishPayload } from "./types";

const BASE_URL = "https://open.tiktokapis.com/v2/post/publish/video";

/**
 * STEP 1: INIT UPLOAD
 */
const initUpload = async (
  videoUrl: string,
  content: string,
  accessToken: string
) => {
  const res = await axios.post(
    `${BASE_URL}/init/`,
    {
      post_info: {
        title: content,
        privacy_level: "PUBLIC_TO_EVERYONE",
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: videoUrl,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return res.data?.data;
};

/**
 * STEP 2: CHECK STATUS
 */
const checkStatus = async (publishId: string, accessToken: string) => {
  const res = await axios.get(
    `https://open.tiktokapis.com/v2/post/publish/status/`,
    {
      params: { publish_id: publishId },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.data?.data;
};

/**
 * STEP 3: WAIT FOR COMPLETION (IMPORTANT)
 */
const waitForProcessing = async (
  publishId: string,
  accessToken: string,
  retries = 10
) => {
  for (let i = 0; i < retries; i++) {
    const status = await checkStatus(publishId, accessToken);

    console.log(`🎵 TikTok status attempt ${i + 1}:`, status);

    if (status?.status === "PUBLISHED") {
      return status;
    }

    if (status?.status === "FAILED") {
      throw new Error("TikTok publishing failed");
    }

    // wait 3 seconds before retry
    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error("TikTok publish timeout");
};

/**
 * 🚀 MAIN FUNCTION
 */
export const publishToTikTok = async (payload: PublishPayload) => {
  const { content, mediaUrls, accessToken } = payload;

  if (!mediaUrls?.length) {
    throw new Error("TikTok requires a video URL");
  }

  const videoUrl = mediaUrls[0];

  try {
    console.log("🎵 TikTok publish started...");

    // STEP 1: INIT
    const initData = await initUpload(videoUrl, content, accessToken);

    if (!initData?.publish_id) {
      throw new Error("Failed to initialize TikTok upload");
    }

    const publishId = initData.publish_id;

    console.log("📤 TikTok publish ID:", publishId);

    // STEP 2 + 3: WAIT FOR COMPLETION
    const finalStatus = await waitForProcessing(publishId, accessToken);

    return {
      success: true,
      platform: "tiktok",
      publishId,
      status: finalStatus,
    };
  } catch (error: any) {
    console.error(
      "❌ TikTok publish failed:",
      error.response?.data || error.message
    );

    throw error;
  }
};
