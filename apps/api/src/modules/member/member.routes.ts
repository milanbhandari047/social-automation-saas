import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/role.middleware";

import {
  getMembers,
  inviteMember,
  removeMember,
  changeRole,
} from "./member.controller";

const router = Router();

/**
 * =========================
 * GET MEMBERS
 * =========================
 */
router.get(
  "/:workspaceId",
  authMiddleware,
  requireRole(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
  getMembers
);

/**
 * =========================
 * INVITE MEMBER
 * =========================
 */
router.post(
  "/:workspaceId/invite",
  authMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  inviteMember
);

/**
 * =========================
 * REMOVE MEMBER
 * =========================
 */
router.delete(
  "/:workspaceId/members/:userId",
  authMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  removeMember
);

/**
 * =========================
 * CHANGE ROLE
 * =========================
 */
router.patch(
  "/:workspaceId/members/:userId/role",
  authMiddleware,
  requireRole(["OWNER", "ADMIN"]),
  changeRole
);

export default router;
