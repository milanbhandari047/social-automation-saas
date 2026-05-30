import { prisma } from "@repo/db";
import {
  registerUser,
  loginUser,
  createSession,
  findSession,
  logoutService,
} from "../services/auth.service";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

/**
 * =========================
 * REGISTER
 * =========================
 */
export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await createSession(user.id, refreshToken, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookies only over HTTPS in production
      sameSite: "lax",
      path: "/", // Only send to refresh endpoint
    });

    return res.json({
      user,
      accessToken,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * =========================
 * LOGIN
 * =========================
 */
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await createSession(user.id, refreshToken, req);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookies only over HTTPS in production
      sameSite: "lax", // Adjust as needed (strict/lax)
      path: "/", // Only send to refresh endpoint
    });

    return res.json({
      user,
      accessToken,
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

/**
 * =========================
 * REFRESH (SILENT AUTH)
 * =========================
 */
export const refresh = async (req: any, res: any) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const session = await findSession(token);

    if (!session) {
      return res.status(401).json({ message: "Session not found" });
    }

    // 🔥 ROTATE SESSION (IMPORTANT)
    await prisma.session.delete({
      where: { id: session.id },
    });

    const payload = {
      id: session.user.id,
      email: session.user.email,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await createSession(session.user.id, newRefreshToken, req);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // secure cookies only over HTTPS in production
      sameSite: "lax", // Adjust as needed (strict/lax)
      path: "/", // Make it available to all routes (or adjust as needed)
    });

    return res.json({
      accessToken: newAccessToken,
    });
  } catch {
    return res.status(500).json({ message: "Refresh failed" });
  }
};

/**
 * =========================
 * LOGOUT
 * =========================
 */
export const logout = async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    await logoutService(userId);
    // Must match the same options used when setting the cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("refreshToken");

    return res.json({
      success: true,
      message: "Logged out",
    });
  } catch {
    return res.status(500).json({ message: "Logout failed" });
  }
};

//* =========================
//* GET CURRENT USER (ME)
//* =========================

export const me = async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch {
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
