import { prisma } from "@repo/db";

export const requireWorkspaceAccess = async (req: any, res: any, next: any) => {
  try {
    const userId = req.user.id;
    const workspaceId = req.params.workspaceId;

    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      select: { id: true },
    });

    if (!workspace) {
      return res.status(403).json({ message: "No workspace access" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: "Workspace check failed" });
  }
};
