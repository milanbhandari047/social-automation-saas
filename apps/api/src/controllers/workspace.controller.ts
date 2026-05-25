import {
  createWorkspaceService,
  getWorkspaceByIdService,
  getWorkspacesService,
} from "../services/workspace.service";

/**
 * =========================
 * CREATE WORKSPACE
 * =========================
 */
export const createWorkspace = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const workspace = await createWorkspaceService(name, userId);

    return res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error creating workspace",
    });
  }
};

/**
 * =========================
 * GET ALL WORKSPACES
 * =========================
 */
export const getWorkspaces = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const workspaces = await getWorkspacesService(userId);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error fetching workspaces",
    });
  }
};

/**
 * =========================
 * GET WORKSPACE BY ID
 * =========================
 */
export const getWorkspaceById = async (req: any, res: any) => {
  try {
    const { workspaceId } = req.params; // ✅ FIXED
    const userId = req.user.id;

    const workspace = await getWorkspaceByIdService(workspaceId, userId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or no access",
      });
    }

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || "Error fetching workspace",
    });
  }
};
