import axios from "axios";
import { PublishPayload } from "src/publishers/types";
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN!;
const TIKTOK_API = "https://open.tiktokapis.com/v2";

export const publishTikTokPost = async (payload: PublishPayload) => {
  const { content, mediaUrl } = payload;

  if (!mediaUrl) {
    throw new Error("TikTok requires mediaUrl (video)");
  }

  try {
    // 1️⃣ Initialize upload
    const initRes = await axios.post(
      `${TIKTOK_API}/post/publish/video/init/`,
      {
        post_info: {
          title: content || "",
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: mediaUrl,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${TIKTOK_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const publishId = initRes.data?.data?.publish_id;

    return {
      success: true,
      platform: "TIKTOK",
      id: publishId,
    };
  } catch (error: any) {
    throw error;
  }
};
