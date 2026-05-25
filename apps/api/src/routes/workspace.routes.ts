import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireWorkspaceAccess } from "../middleware/workspace.middleware";
import { requireRole } from "../middleware/role.middleware";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
} from "../controllers/workspace.controller";

const router = Router();

/**
 * CREATE WORKSPACE
 */
router.post("/", authMiddleware, createWorkspace);

/**
 * GET ALL WORKSPACES
 */
router.get("/", authMiddleware, getWorkspaces);

/**
 * GET SINGLE WORKSPACE (SECURED)
 */
router.get(
  "/:workspaceId",
  authMiddleware,
  requireWorkspaceAccess,
  getWorkspaceById
);

export default router;
