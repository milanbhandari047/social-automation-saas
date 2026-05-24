import express from "express";
import { generateCaptionController } from "./ai.controller";

const router = express.Router();

router.post("/generate-caption", generateCaptionController);

export default router;
