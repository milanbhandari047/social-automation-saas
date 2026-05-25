// import { prisma } from "@repo/db";
// import redis from "../lib/redis";
// export const getWorkspaceRole = async (workspaceId: string, userId: string) => {
//   const cacheKey = `workspace:${workspaceId}:user:${userId}`;

//   // 1. check cache
//   const cachedRole = await redis.get(cacheKey);

//   if (cachedRole) return cachedRole;

//   // 2. DB fallback
//   const member = await prisma.workspaceMember.findFirst({
//     where: {
//       workspaceId,
//       userId,
//     },
//   });

//   if (!member) return null;

//   const role = member.role;

//   // 3. cache it
//   await redis.set(cacheKey, role, {
//     EX: 300, // 5 min
//   });

//   return role;
// };

import { prisma } from "@repo/db";

export const getWorkspaceRole = async (workspaceId: string, userId: string) => {
  const member = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId,
    },
    select: {
      role: true,
    },
  });

  return member?.role || null;
};
