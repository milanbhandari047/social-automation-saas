import axios from "axios";

export const publishToFacebook = async (
  content: string,
  accessToken: string,
  pageId: string
) => {
  const url = `https://graph.facebook.com/v19.0/${pageId}/feed`;

  const response = await axios.post(url, null, {
    params: {
      message: content,
      access_token: accessToken,
    },
  });

  return response.data;
};
