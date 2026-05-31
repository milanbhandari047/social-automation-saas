import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireWorkspaceAccess } from "../middleware/workspace.middleware";
import { requireRole } from "../middleware/role.middleware";

import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "../controllers/workspace.controller";

const router = Router();

/**
 * CREATE WORKSPACE
 * POST /api/workspaces
 */
router.post("/", authMiddleware, createWorkspace);

/**
 * GET ALL WORKSPACES
 * GET /api/workspaces
 */
router.get("/", authMiddleware, getWorkspaces);

/**
 * GET SINGLE WORKSPACE
 * GET /api/workspaces/:workspaceId
 */
router.get(
  "/:workspaceId",
  authMiddleware,
  requireWorkspaceAccess,
  getWorkspaceById
);

/**
 * UPDATE WORKSPACE (RENAME) — OWNER ONLY
 * PUT /api/workspaces/:workspaceId
 */
router.put(
  "/:workspaceId",
  authMiddleware,
  requireWorkspaceAccess,
  requireRole(["OWNER"]),
  updateWorkspace
);

/**
 * DELETE WORKSPACE — OWNER ONLY
 * DELETE /api/workspaces/:workspaceId
 */
router.delete(
  "/:workspaceId",
  authMiddleware,
  requireWorkspaceAccess,
  requireRole(["OWNER"]),
  deleteWorkspace
);

export default router;
