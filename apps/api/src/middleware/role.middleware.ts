import { getWorkspaceRole } from "../services/workspace-role.service";

export const requireRole = (allowedRoles: string[]) => {
  return async (req: any, res: any, next: any) => {
    const workspaceId = req.params.workspaceId;
    const userId = req.user.id;

    const role = await getWorkspaceRole(workspaceId, userId);

    if (!role) {
      return res.status(403).json({ message: "No role found" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    req.workspaceRole = role;

    next();
  };
};
