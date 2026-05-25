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
      req.user.id, // ✅ FIXED
      req.body
    );

    return res.status(201).json({
      success: true,
      data: socialAccount,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to connect social account",
    });
  }
};

/**
 * GET SOCIAL ACCOUNTS
 */
export const getSocialAccounts = async (req: any, res: any) => {
  try {
    const { workspaceId } = req.params; // ✅ FIXED

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "workspaceId is required",
      });
    }

    const socialAccounts = await getSocialAccountsService(
      req.user.id, // ✅ FIXED
      workspaceId
    );

    return res.json({
      success: true,
      data: socialAccounts,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch social accounts",
    });
  }
};

/**
 * DELETE SOCIAL ACCOUNT
 */
export const deleteSocialAccount = async (req: any, res: any) => {
  try {
    const { id: socialAccountId } = req.params; // ✅ FIXED

    await deleteSocialAccountService(req.user.id, socialAccountId);

    return res.json({
      success: true,
      message: "Social account deleted",
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete social account",
    });
  }
};
