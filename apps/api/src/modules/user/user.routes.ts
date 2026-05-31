import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware";
import { searchUserByEmail, getUserById } from "./user.controller";

const router = Router();

/**
 * SEARCH USER BY EMAIL
 * GET /api/users/search?email=...
 */
router.get("/search", authMiddleware, searchUserByEmail);

/**
 * GET USER BY ID
 * GET /api/users/:userId
 */
router.get("/:userId", authMiddleware, getUserById);

export default router;
