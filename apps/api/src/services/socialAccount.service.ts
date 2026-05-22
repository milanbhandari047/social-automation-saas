import { prisma } from "@repo/db";

/**
 * CREATE SOCIAL ACCOUNT
 */
export const createSocialAccountService = async (
  userId: string,
  data: {
    platform: "FACEBOOK" | "INSTAGRAM" | "TIKTOK";
    accessToken: string;
    workspaceId: string;
  }
) => {
  // verify workspace ownership
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: data.workspaceId,
      ownerId: userId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return prisma.socialAccount.create({
    data,
  });
};

/**
 * GET SOCIAL ACCOUNTS
 */
export const getSocialAccountsService = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      ownerId: userId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return prisma.socialAccount.findMany({
    where: {
      workspaceId,
    },
  });
};

/**
 * DELETE SOCIAL ACCOUNT
 */
export const deleteSocialAccountService = async (
  userId: string,
  socialAccountId: string
) => {
  const socialAccount = await prisma.socialAccount.findUnique({
    where: {
      id: socialAccountId,
    },
    include: {
      workspace: true,
    },
  });

  if (!socialAccount) {
    throw new Error("Social account not found");
  }

  if (socialAccount.workspace.ownerId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.socialAccount.delete({
    where: {
      id: socialAccountId,
    },
  });

  return true;
};
