import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  connectSocialAccount,
  getSocialAccounts,
  deleteSocialAccount,
} from "../controllers/socialAccount.controller";

const router = Router();

router.post("/", authMiddleware, connectSocialAccount);

router.get("/:workspaceId", authMiddleware, getSocialAccounts);

router.delete("/:id", authMiddleware, deleteSocialAccount);

export default router;
