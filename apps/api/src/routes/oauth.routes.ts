import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import {
  redirectToFacebook,
  facebookCallback,
} from "../controllers/ oauth.controller";

const router = Router();

/**
 * REDIRECT USER TO FACEBOOK
 */
router.get("/facebook", authMiddleware, redirectToFacebook);

/**
 * FACEBOOK CALLBACK
 */
router.get("/facebook/callback", facebookCallback);

export default router;
