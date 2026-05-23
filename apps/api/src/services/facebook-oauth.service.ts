import { prisma } from "@repo/db";

import {
  exchangeCodeForAccessToken,
  generateFacebookLoginUrl,
  getFacebookPages,
} from "../utils/facebook";

/**
 * LOGIN URL
 */
export const getFacebookLoginUrlService = (userId: string) => {
  return generateFacebookLoginUrl(userId);
};

/**
 * HANDLE CALLBACK
 */
export const handleFacebookCallbackService = async (
  code: string,
  userId: string
) => {
  /**
   * GET ACCESS TOKEN
   */
  const accessToken = await exchangeCodeForAccessToken(code);

  /**
   * GET FACEBOOK PAGES
   */
  const pages = await getFacebookPages(accessToken);

  /**
   * GET USER WORKSPACE
   */
  const workspace = await prisma.workspace.findFirst({
    where: {
      ownerId: userId,
    },
  });

  if (!workspace) {
    throw new Error("No workspace found");
  }

  /**
   * SAVE PAGES
   */
  for (const page of pages) {
    await prisma.socialAccount.upsert({
      where: {
        accountId: page.id,
      },

      update: {
        accessToken: page.access_token,
        accountName: page.name,
      },

      create: {
        platform: "FACEBOOK",

        accessToken: page.access_token,

        accountId: page.id,
        accountName: page.name,

        workspaceId: workspace.id,
      },
    });
  }

  return pages;
};
