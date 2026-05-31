import { prisma } from "@repo/db";
import { generateAccessToken } from "../../utils/jwt";

/**
 * =========================
 * GET ALL MEMBERS
 * =========================
 */
export const getMembersService = async (workspaceId: string) => {
  return prisma.workspaceMember.findMany({
    where: {
      workspaceId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
};

/**
 * =========================
 * INVITE MEMBER
 * =========================
 */

export const inviteMemberService = async (
  workspaceId: string,
  userId: string,
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER"
) => {
  // prevent duplicate member
  const existing = await prisma.workspaceMember.findFirst({
    where: { workspaceId, userId },
  });
  if (existing) {
    throw new Error("User already in workspace");
  }

  // ← ADD THIS — check plan limit
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!workspace) throw new Error("Workspace not found");

  const memberCount = await prisma.workspaceMember.count({
    where: { workspaceId, role: { not: "OWNER" } },
  });
  if (memberCount >= workspace.maxTeamMembers) {
    throw new Error("Team member limit reached. Upgrade your plan.");
  }

  return prisma.workspaceMember.create({
    data: { workspaceId, userId, role },
  });
};

/**
 * =========================
 * REMOVE MEMBER
 * =========================
 */
export const removeMemberService = async (
  workspaceId: string,
  userId: string
) => {
  return prisma.workspaceMember.deleteMany({
    where: {
      workspaceId,
      userId,
    },
  });
};

/**
 * =========================
 * CHANGE ROLE + ISSUE NEW TOKEN
 * =========================
 */
export const changeRoleService = async (
  workspaceId: string,
  userId: string,
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER"
) => {
  // update role
  const updated = await prisma.workspaceMember.updateMany({
    where: {
      workspaceId,
      userId,
    },
    data: {
      role,
    },
  });

  // 🔥 ISSUE NEW TOKEN (short-lived JWT system)
  const newToken = generateAccessToken({
    id: userId,
    workspaceId,
    role,
  });

  return {
    updated,
    token: newToken,
  };
};
