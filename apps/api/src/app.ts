import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import socialAccountRoutes from "./routes/socialAccount.routes";
import postRoutes from "./routes/post.routes";
import oauthRoutes from "./routes/oauth.routes";
import analyticsRoutes from "./modules/analytics/routes/analytics.routes";
import mediaRoutes from "./modules/media/media.routes";
import aiRoutes from "./modules/ai/ai.routes";

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/social-accounts", socialAccountRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Social Automation API Running 🚀",
  });
});

export default app;
