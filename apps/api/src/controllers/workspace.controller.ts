import {
  createWorkspaceService,
  getWorkspaceByIdService,
  getWorkspacesService,
} from "../services/workspaace.service";

export const createWorkspace = async (req: any, res: any) => {
  try {
    const { name } = req.body;
    const userId = req.user.userId;
    const workspace = await createWorkspaceService(name, userId);
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Error creating workspace" });
  }
};

export const getWorkspaces = async (req: any, res: any) => {
  try {
    const userId = req.user.userId;
    const workspaces = await getWorkspacesService(userId);
    res.json(workspaces);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workspaces" });
  }
};

export const getWorkspaceById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const workspace = await getWorkspaceByIdService(id, userId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    res.json(workspace);
  } catch (err) {
    res.status(500).json({ message: "Error fetching workspace" });
  }
};
