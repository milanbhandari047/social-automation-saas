import { prisma } from "@repo/db";

export const createWorkspaceService = async (name: string, userId: string) => {
  return await prisma.workspace.create({
    data: { name, ownerId: userId },
  });
};

export const getWorkspacesService = async (userId: string) => {
  return await prisma.workspace.findMany({
    where: { ownerId: userId },
  });
};

export const getWorkspaceByIdService = async (id: string, userId: string) => {
  return await prisma.workspace.findFirst({
    where: { id, ownerId: userId },
  });
};
