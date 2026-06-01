import { prisma } from "@repo/db";
import {
  exchangeCodeForAccessToken,
  getFacebookPages,
  getInstagramAccount,
  generateFacebookLoginUrl,
} from "../utils/facebook";

/**
 * LOGIN URL
 */
export const getFacebookLoginUrlService = (userId: string) => {
  return generateFacebookLoginUrl(userId);
};

/**
 * HANDLE CALLBACK
 * Saves both Facebook Pages and linked Instagram accounts
 */
export const handleFacebookCallbackService = async (
  code: string,
  userId: string
) => {
  // 1. Exchange code for user access token
  const userAccessToken = await exchangeCodeForAccessToken(code);

  // 2. Get all Facebook pages
  const pages = await getFacebookPages(userAccessToken);

  // 3. Get user's workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      members: { some: { userId } },
    },
  });

  if (!workspace) {
    throw new Error("No workspace found for this user");
  }

  const savedAccounts = [];

  // 4. Save each Facebook page + check for linked Instagram
  for (const page of pages) {
    // Save Facebook page
    const fbAccount = await prisma.socialAccount.upsert({
      where: { accountId: page.id },
      update: {
        accessToken: page.access_token,
        accountName: page.name,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        platform: "FACEBOOK",
        accessToken: page.access_token,
        accountId: page.id,
        accountName: page.name,
        workspaceId: workspace.id,
        isActive: true,
      },
    });

    savedAccounts.push(fbAccount);

    // Check if this page has a linked Instagram Business account
    const igAccount = await getInstagramAccount(page.id, page.access_token);

    if (igAccount) {
      const savedIg = await prisma.socialAccount.upsert({
        where: { accountId: igAccount.id },
        update: {
          accessToken: igAccount.pageAccessToken,
          accountName: igAccount.name ?? igAccount.username,
          isActive: true,
          updatedAt: new Date(),
        },
        create: {
          platform: "INSTAGRAM",
          accessToken: igAccount.pageAccessToken, // page token used for IG publishing
          accountId: igAccount.id,
          accountName: igAccount.name ?? igAccount.username,
          workspaceId: workspace.id,
          isActive: true,
        },
      });

      savedAccounts.push(savedIg);
    }
  }

  return savedAccounts;
};
