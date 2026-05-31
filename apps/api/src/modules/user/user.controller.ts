import { searchUserByEmailService, getUserByIdService } from "./user.service";

/**
 * SEARCH USER BY EMAIL
 */
export const searchUserByEmail = async (req: any, res: any) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await searchUserByEmailService(String(email));

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({ message: err.message || "User not found" });
  }
};

/**
 * GET USER BY ID
 */
export const getUserById = async (req: any, res: any) => {
  try {
    const { userId } = req.params;

    const user = await getUserByIdService(userId);

    return res.json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(404).json({ message: err.message || "User not found" });
  }
};
