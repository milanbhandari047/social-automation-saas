import dotenv from "dotenv";
// Load env from repo root and fallback to app dir
dotenv.config({ path: "../../.env" });
dotenv.config({ path: "./.env" });

import app from "./app";

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});
