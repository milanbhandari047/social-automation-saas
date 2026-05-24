import axios from "axios";
import { PublishPayload } from "./types";

export const publishToFacebook = async (payload: PublishPayload) => {
  const { content, accessToken, accountId } = payload;

  const url = `https://graph.facebook.com/v19.0/${accountId}/feed`;

  const response = await axios.post(url, null, {
    params: {
      message: content,
      access_token: accessToken,
    },
  });

  return response.data;
};
