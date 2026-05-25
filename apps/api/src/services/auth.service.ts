import { prisma } from "@repo/db";
import bcrypt from "bcryptjs";

/**
 * REGISTER USER
 */
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: { name, email, password: hashed },
  });
};

/**
 * LOGIN USER
 */
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) throw new Error("Invalid credentials");

  return user;
};

/**
 * CREATE SESSION
 */
export const createSession = async (
  userId: string,
  refreshToken: string,
  req: any
) => {
  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
};

/**
 * FIND SESSION
 */
export const findSession = async (refreshToken: string) => {
  return prisma.session.findFirst({
    where: { refreshToken },
    include: { user: true },
  });
};

/**
 * LOGOUT (ALL DEVICES)
 */
export const logoutService = async (userId: string) => {
  await prisma.session.deleteMany({
    where: { userId },
  });

  return true;
};
