import axios from "axios";
import { PublishPayload } from "./types";

export const publishToFacebook = async (payload: PublishPayload) => {
  const { content, accessToken, accountId, mediaUrl } = payload;

  try {
    /**
     * 🖼 IMAGE POST
     */
    if (mediaUrl?.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const response = await axios.post(
        `https://graph.facebook.com/v19.0/${accountId}/photos`,
        null,
        {
          params: {
            url: mediaUrl,
            caption: content,
            access_token: accessToken,
          },
        }
      );

      return response.data;
    }

    /**
     * 🎥 VIDEO POST
     */
    if (mediaUrl?.match(/\.(mp4|mov|avi)$/i)) {
      const response = await axios.post(
        `https://graph-video.facebook.com/v19.0/${accountId}/videos`,
        null,
        {
          params: {
            file_url: mediaUrl,
            description: content,
            access_token: accessToken,
          },
        }
      );

      return response.data;
    }

    /**
     * 📝 TEXT POST
     */
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${accountId}/feed`,
      null,
      {
        params: {
          message: content,
          access_token: accessToken,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Facebook publish failed:",
      error.response?.data || error.message
    );

    throw error;
  }
};
