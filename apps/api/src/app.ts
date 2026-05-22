import { prisma } from "@repo/db";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Social Automation API Running 🚀",
  });
});

app.get("/test-db", (req, res) => {
  res.json({
    message: "Database route working 🚀",
  });
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
export default app;
