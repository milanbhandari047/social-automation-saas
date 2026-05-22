import {
  createSocialAccountService,
  getSocialAccountsService,
  deleteSocialAccountService,
} from "../services/socialAccount.service";

/**
 * CONNECT SOCIAL ACCOUNT
 */
export const connectSocialAccount = async (req: any, res: any) => {
  try {
    const socialAccount = await createSocialAccountService(
      req.user.userId,
      req.body
    );

    res.json(socialAccount);
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message || "Failed to connect social account",
    });
  }
};

/**
 * GET SOCIAL ACCOUNTS
 */
export const getSocialAccounts = async (req: any, res: any) => {
  try {
    const socialAccounts = await getSocialAccountsService(
      req.user.userId,
      req.params.workspaceId
    );

    res.json(socialAccounts);
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message || "Failed to fetch social accounts",
    });
  }
};

/**
 * DELETE SOCIAL ACCOUNT
 */
export const deleteSocialAccount = async (req: any, res: any) => {
  try {
    await deleteSocialAccountService(req.user.userId, req.params.id);

    res.json({
      message: "Social account deleted",
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message || "Failed to delete social account",
    });
  }
};
