import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Expired token" });
  }

  req.user = decoded;
  next();
};
