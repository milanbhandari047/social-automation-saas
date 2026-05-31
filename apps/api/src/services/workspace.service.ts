import { WorkspaceRole } from "@prisma/client";
import { prisma } from "@repo/db";

/**
 * =========================
 * CREATE WORKSPACE (WITH OWNER MEMBERSHIP)
 * =========================
 */
// apps/api/src/services/workspace.service.ts
export const createWorkspaceService = async (name: string, userId: string) => {
  const result = await prisma.workspace.create({
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
    include: { members: true },
  });

  return result;
};

/**
 * =========================
 * GET ALL WORKSPACES (USER IS MEMBER OR OWNER)
 * =========================
 */
export const getWorkspacesService = async (userId: string) => {
  return await prisma.workspace.findMany({
    where: {
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
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
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: true,
      socialAccounts: true,
      posts: true,
    },
  });
};

/**
 * =========================
 * UPDATE WORKSPACE (RENAME) — OWNER ONLY
 * =========================
 */
export const updateWorkspaceService = async (
  id: string,
  userId: string,
  name: string
) => {
  // Only owner can rename
  const workspace = await prisma.workspace.findFirst({
    where: { id, ownerId: userId },
  });

  if (!workspace) throw new Error("Workspace not found or not authorized");

  return await prisma.workspace.update({
    where: { id },
    data: { name },
    include: { members: true },
  });
};

/**
 * =========================
 * DELETE WORKSPACE — OWNER ONLY
 * =========================
 */
export const deleteWorkspaceService = async (id: string, userId: string) => {
  // Only owner can delete
  const workspace = await prisma.workspace.findFirst({
    where: { id, ownerId: userId },
  });

  if (!workspace) throw new Error("Workspace not found or not authorized");

  // Cascade delete handled by Prisma schema (onDelete: Cascade)
  return await prisma.workspace.delete({
    where: { id },
  });
};
