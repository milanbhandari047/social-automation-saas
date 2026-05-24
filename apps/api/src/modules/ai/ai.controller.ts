import { Request, Response } from "express";
import { generateCaptionAI } from "./ai.service";

export const generateCaptionController = async (
  req: Request,
  res: Response
) => {
  try {
    const { topic, tone, platform } = req.body;

    const result = await generateCaptionAI({
      topic,
      tone,
      platform,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
