import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  facebookCallback,
  redirectToFacebook,
} from "../controllers/ oauth.controller";

const router = Router();

/**
 * REDIRECT USER TO FACEBOOK
 * GET /api/oauth/facebook
 */
router.get("/facebook", authMiddleware, redirectToFacebook);

/**
 * FACEBOOK CALLBACK
 * GET /api/oauth/facebook/callback
 */
router.get("/facebook/callback", facebookCallback);

export default router;
