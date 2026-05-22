import { prisma } from "@repo/db";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import socialAccountRoutes from "./routes/socialAccount.routes";
import postRoutes from "./routes/post.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/social-accounts", socialAccountRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Social Automation API Running 🚀",
  });
});

export default app;
