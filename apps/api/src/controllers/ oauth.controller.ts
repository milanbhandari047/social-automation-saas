import { handleFacebookCallbackService } from "../services/facebook-oauth.service";

import { generateFacebookLoginUrl } from "../utils/facebook";

/**
 * REDIRECT TO FACEBOOK
 */
export const redirectToFacebook = async (req: any, res: any) => {
  const url = generateFacebookLoginUrl(req.user.userId);

  return res.redirect(url);
};

/**
 * FACEBOOK CALLBACK
 */
export const facebookCallback = async (req: any, res: any) => {
  try {
    const { code, state } = req.query;

    const result = await handleFacebookCallbackService(code, state);

    return res.json({
      message: "Facebook connected successfully",
      result,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
