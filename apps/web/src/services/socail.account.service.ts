import { api } from "@/lib/api";

export interface SocialAccount {
  id: string;
  platform: "FACEBOOK" | "INSTAGRAM" | "TIKTOK";
  accountId: string;
  accountName?: string;
  accessToken?: string;
  isActive: boolean;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectSocialAccountPayload {
  platform: "FACEBOOK" | "INSTAGRAM" | "TIKTOK";
  accessToken: string;
  workspaceId: string;
  accountId: string;
  accountName?: string;
  refreshToken?: string;
}

/**
 * CONNECT SOCIAL ACCOUNT
 */
export const connectSocialAccount = async (
  payload: ConnectSocialAccountPayload
): Promise<SocialAccount> => {
  const response = await api.post("/social-accounts", payload);
  return response.data.data;
};

/**
 * GET SOCIAL ACCOUNTS BY WORKSPACE
 */
export const getSocialAccounts = async (
  workspaceId: string
): Promise<SocialAccount[]> => {
  const response = await api.get(`/social-accounts/${workspaceId}`);
  return response.data.data;
};

/**
 * DELETE SOCIAL ACCOUNT
 */
export const deleteSocialAccount = async (
  socialAccountId: string
): Promise<void> => {
  await api.delete(`/social-accounts/${socialAccountId}`);
};
