import { prisma } from "@repo/db";

/**
 * SEARCH USER BY EMAIL
 */
export const searchUserByEmailService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

/**
 * GET USER BY ID
 */
export const getUserByIdService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};
