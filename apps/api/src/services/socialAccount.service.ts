import { prisma } from "@repo/db";

/**
 * =========================
 * CREATE SOCIAL ACCOUNT (MEMBERSHIP BASED ACCESS)
 * =========================
 */
export const createSocialAccountService = async (
  userId: string,
  data: {
    platform: "FACEBOOK" | "INSTAGRAM" | "TIKTOK";
    accessToken: string;
    workspaceId: string;
    accountId: string;
    accountName?: string;
    refreshToken?: string;
  }
) => {
  // ✅ FIX: check membership instead of only owner
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: data.workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or no access");
  }

  return prisma.socialAccount.upsert({
    where: {
      accountId: data.accountId,
    },
    update: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accountName: data.accountName,
      isActive: true,
      updatedAt: new Date(),
    },
    create: {
      platform: data.platform,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      accountId: data.accountId,
      accountName: data.accountName,
      workspaceId: data.workspaceId,
      isActive: true,
    },
  });
};

/**
 * =========================
 * GET SOCIAL ACCOUNTS (MEMBERSHIP BASED ACCESS)
 * =========================
 */
export const getSocialAccountsService = async (
  userId: string,
  workspaceId: string
) => {
  // 🔥 DEBUG CHECK (TEMPORARY)
  const member = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspaceId,
    },
  });

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId,
        },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or no access");
  }

  return prisma.socialAccount.findMany({
    where: {
      workspaceId,
    },
  });
};
/**
 * =========================
 * DELETE SOCIAL ACCOUNT (SAFE RBAC CHECK)
 * =========================
 */
export const deleteSocialAccountService = async (
  userId: string,
  socialAccountId: string
) => {
  const socialAccount = await prisma.socialAccount.findUnique({
    where: {
      id: socialAccountId,
    },
    select: {
      id: true,
      workspaceId: true,
      workspace: {
        select: {
          members: {
            where: {
              userId,
            },
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!socialAccount) {
    throw new Error("Social account not found");
  }

  const member = socialAccount.workspace.members[0];

  if (!member) {
    throw new Error("Unauthorized");
  }

  // optional: restrict delete only to OWNER/ADMIN
  if (!["OWNER", "ADMIN"].includes(member.role)) {
    throw new Error("Insufficient permissions");
  }

  return prisma.socialAccount.delete({
    where: {
      id: socialAccountId,
    },
  });
};
