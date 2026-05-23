import axios from "axios";

export const publishToFacebook = async (message: string) => {
  const PAGE_ID = process.env.FB_PAGE_ID!;
  const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN!;

  const url = `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;

  const res = await axios.post(url, null, {
    params: {
      message,
      access_token: ACCESS_TOKEN,
    },
  });

  return res.data;
};
