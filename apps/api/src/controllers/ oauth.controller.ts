import { handleFacebookCallbackService } from "../services/facebook-oauth.service";
import { generateFacebookLoginUrl } from "../utils/facebook";

/**
 * REDIRECT TO FACEBOOK
 */
export const redirectToFacebook = async (req: any, res: any) => {
  const url = generateFacebookLoginUrl(req.user.id);
  return res.redirect(url);
};

/**
 * FACEBOOK CALLBACK
 */
export const facebookCallback = async (req: any, res: any) => {
  try {
    const { code, state } = req.query;
    await handleFacebookCallbackService(code, state);

    return res.redirect(
      `${process.env.FRONTEND_URL}/social-accounts?connected=true`
    );
  } catch (error: any) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/social-accounts?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};
