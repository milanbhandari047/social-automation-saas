import { Request, Response } from "express";
import { getFullAnalytics } from "./analytics.service";

const getParam = (v: string | string[]) => (Array.isArray(v) ? v[0] : v);

export const analyticsController = async (req: Request, res: Response) => {
  try {
    const workspaceId = getParam(req.params.workspaceId);

    const data = await getFullAnalytics(workspaceId);

    res.json({
      success: true,
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
