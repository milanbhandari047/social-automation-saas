import axios from "axios";

/**
 * GENERATE FACEBOOK LOGIN URL
 */
export const generateFacebookLoginUrl = (userId: string) => {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
    scope: "pages_manage_posts,pages_read_engagement,pages_show_list",
    response_type: "code",
    state: userId,
  });

  return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
};

/**
 * EXCHANGE CODE FOR ACCESS TOKEN
 */
export const exchangeCodeForAccessToken = async (code: string) => {
  const response = await axios.get(
    "https://graph.facebook.com/v19.0/oauth/access_token",
    {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        code,
      },
    }
  );

  return response.data.access_token;
};

/**
 * GET FACEBOOK PAGES
 */
export const getFacebookPages = async (accessToken: string) => {
  const response = await axios.get(
    "https://graph.facebook.com/v19.0/me/accounts",
    {
      params: {
        access_token: accessToken,
      },
    }
  );

  return response.data.data;
};
