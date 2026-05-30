import axios from "axios";
import { PublishPayload } from "./types";
import { publishInstagramPost } from "src/services/instagram.service";

export const publishToInstagram = async (payload: PublishPayload) => {
  try {
    const result = await publishInstagramPost(payload);
    return result;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.error?.message || "Instagram publish failed"
    );
  }
};
