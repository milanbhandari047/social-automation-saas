import { PublishPayload } from "./types";

export const publishToInstagram = async (payload: PublishPayload) => {
  console.log("📸 Instagram publishing placeholder");

  if (!payload.mediaUrls?.length) {
    throw new Error("Instagram requires media");
  }

  return {
    success: true,
    platform: "instagram",
  };
};
