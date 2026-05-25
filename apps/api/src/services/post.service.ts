import { prisma } from "@repo/db";
import { postQueue } from "../queues/post.queue";

/**
 * =========================
 * CREATE POST
 * =========================
 */
export const createPostService = async (userId: string, data: any) => {
  console.log("DEBUG:", { userId, workspaceId: data.workspaceId });

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: data.workspaceId,
      members: {
        some: { userId },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or no access");
  }

  const validAccounts = await prisma.socialAccount.findMany({
    where: {
      id: { in: data.socialAccountIds },
      workspaceId: data.workspaceId,
      isActive: true,
    },
  });

  if (validAccounts.length === 0) {
    throw new Error("No valid social accounts found");
  }

  const post = await prisma.post.create({
    data: {
      content: data.content,
      mediaUrl: data.mediaUrl,
      workspaceId: data.workspaceId,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      status: data.scheduledAt ? "SCHEDULED" : "DRAFT",
    },
  });

  await prisma.postTarget.createMany({
    data: validAccounts.map((a: any) => ({
      postId: post.id,
      socialAccountId: a.id,
      status: "DRAFT",
    })),
  });

  return post;
};

/**
 * =========================
 * GET WORKSPACE POSTS
 * =========================
 */
export const getWorkspacePostsService = async (
  userId: string,
  workspaceId: string
) => {
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

  return prisma.post.findMany({
    where: {
      workspaceId,
    },
    include: {
      targets: {
        include: {
          socialAccount: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * =========================
 * GET SINGLE POST
 * =========================
 */
export const getPostByIdService = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
      targets: {
        include: {
          socialAccount: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const isMember = post.workspace.members.some((m: any) => m.userId === userId);

  if (!isMember) {
    throw new Error("Unauthorized");
  }

  return post;
};

/**
 * =========================
 * DELETE POST
 * =========================
 */
export const deletePostService = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      workspace: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const isMember = post.workspace.members.some((m: any) => m.userId === userId);

  if (!isMember) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return true;
};
