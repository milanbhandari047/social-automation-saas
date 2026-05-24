import express from "express";
import multer from "multer";
import { uploadMediaController } from "./media.controller";

const router = express.Router();

/**
 * 📦 Store file in memory before upload
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

router.post("/upload", upload.single("file"), uploadMediaController);

export default router;
