import { prisma } from "@repo/db";
import { postQueue } from "../queues/post.queue";

/**
 * CREATE POST
 */
export const createPostService = async (
  userId: string,
  data: {
    content: string;
    mediaUrl?: string;
    workspaceId: string;
    scheduledAt?: string;
    socialAccountIds: string[];
  }
) => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: data.workspaceId,
      ownerId: userId,
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
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
    data: data.socialAccountIds.map((id) => ({
      postId: post.id,
      socialAccountId: id,
      status: "DRAFT",
    })),
  });

  const delay = data.scheduledAt
    ? new Date(data.scheduledAt).getTime() - Date.now()
    : 0;

  await postQueue.add(
    "publish-post",
    { postId: post.id },
    { delay: delay > 0 ? delay : 0 }
  );

  return post;
};

/**
 * GET WORKSPACE POSTS
 */
export const getWorkspacePostsService = async (
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
 * GET SINGLE POST
 */
export const getPostByIdService = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      workspace: true,
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

  if (post.workspace.ownerId !== userId) {
    throw new Error("Unauthorized");
  }

  return post;
};

/**
 * DELETE POST
 */
export const deletePostService = async (userId: string, postId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { workspace: true },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.workspace.ownerId !== userId) {
    throw new Error("Unauthorized");
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return true;
};
