import { WorkspaceRole } from "@prisma/client";
import { prisma } from "@repo/db";

/**
 * =========================
 * CREATE WORKSPACE (WITH OWNER MEMBERSHIP)
 * =========================
 */
export const createWorkspaceService = async (name: string, userId: string) => {
  return await prisma.workspace.create({
    data: {
      name,
      ownerId: userId,

      members: {
        create: {
          userId,
          role: WorkspaceRole.OWNER,
        },
      },
    },
    include: {
      members: true,
    },
  });
};

/**
 * =========================
 * GET ALL WORKSPACES (USER IS MEMBER OR OWNER)
 * =========================
 */
export const getWorkspacesService = async (userId: string) => {
  return await prisma.workspace.findMany({
    where: {
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      members: true,
    },
  });
};

/**
 * =========================
 * GET WORKSPACE BY ID (MEMBER OR OWNER CHECK)
 * =========================
 */
export const getWorkspaceByIdService = async (id: string, userId: string) => {
  return await prisma.workspace.findFirst({
    where: {
      id,
      OR: [
        {
          ownerId: userId,
        },
        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
    include: {
      members: true,
      socialAccounts: true,
      posts: true,
    },
  });
};
