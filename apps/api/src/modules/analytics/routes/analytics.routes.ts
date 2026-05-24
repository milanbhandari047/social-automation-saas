import express from "express";
import { analyticsController } from "../analytics.controller";
const router = express.Router();

/**
 * 📊 WORKSPACE ANALYTICS
 */
router.get("/workspace/:workspaceId", analyticsController);

export default router;
