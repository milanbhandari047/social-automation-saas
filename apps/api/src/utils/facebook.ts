import axios from "axios";

const GRAPH_URL = "https://graph.facebook.com/v19.0";

/**
 * GENERATE FACEBOOK LOGIN URL
 * Includes Instagram permissions
 */
export const generateFacebookLoginUrl = (userId: string) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
    scope: [
      // Facebook permissions
      "pages_manage_posts",
      "pages_read_engagement",
      "pages_show_list",
      // Instagram permissions
      "instagram_basic",
      "instagram_content_publish",
      "instagram_manage_insights",
    ].join(","),
    response_type: "code",
    state: userId,
  });
  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
};

/**
 * EXCHANGE CODE FOR ACCESS TOKEN
 */
export const exchangeCodeForAccessToken = async (code: string) => {
  const response = await axios.get(`${GRAPH_URL}/oauth/access_token`, {
    params: {
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
      code,
    },
  });
  return response.data.access_token;
};

/**
 * GET FACEBOOK PAGES
 */
export const getFacebookPages = async (accessToken: string) => {
  const response = await axios.get(`${GRAPH_URL}/me/accounts`, {
    params: { access_token: accessToken },
  });
  return response.data.data; // [{ id, name, access_token }]
};

/**
 * GET INSTAGRAM ACCOUNT LINKED TO A FACEBOOK PAGE
 * Each Facebook Page can have one linked Instagram Business account
 */
export const getInstagramAccount = async (
  pageId: string,
  pageAccessToken: string
) => {
  try {
    const response = await axios.get(`${GRAPH_URL}/${pageId}`, {
      params: {
        fields: "instagram_business_account",
        access_token: pageAccessToken,
      },
    });

    const igId = response.data?.instagram_business_account?.id;
    if (!igId) return null;

    // Get Instagram account details
    const igResponse = await axios.get(`${GRAPH_URL}/${igId}`, {
      params: {
        fields: "id,name,username,profile_picture_url,followers_count",
        access_token: pageAccessToken,
      },
    });

    return {
      ...igResponse.data,
      pageAccessToken, // store page token — used for publishing
    };
  } catch {
    return null;
  }
};
