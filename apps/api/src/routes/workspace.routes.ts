import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
} from "../controllers/workspace.controller";

const router = Router();

router.post("/", authMiddleware, createWorkspace);
router.get("/", authMiddleware, getWorkspaces);
router.get("/:id", authMiddleware, getWorkspaceById);

export default router;
