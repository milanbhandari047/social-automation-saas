import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  createPost,
  getWorkspacePosts,
  getPostById,
  deletePost,
} from "../controllers/post.controller";

const router = Router();

router.post("/", authMiddleware, createPost);

router.get("/workspace/:workspaceId", authMiddleware, getWorkspacePosts);

router.get("/:id", authMiddleware, getPostById);

router.delete("/:id", authMiddleware, deletePost);

export default router;
