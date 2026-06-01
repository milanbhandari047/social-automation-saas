import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: any, next: any) => {
  // Support token from Authorization header OR query param (for OAuth redirects)
  const authHeader = req.headers.authorization;
  const queryToken = req.query.token as string | undefined;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : queryToken;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
