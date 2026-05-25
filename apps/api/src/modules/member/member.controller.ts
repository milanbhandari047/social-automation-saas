import {
  getMembersService,
  inviteMemberService,
  removeMemberService,
  changeRoleService,
} from "./member.service";

/**
 * =========================
 * GET MEMBERS
 * =========================
 */
export const getMembers = async (req: any, res: any) => {
  try {
    const { workspaceId } = req.params;

    const members = await getMembersService(workspaceId);

    return res.json({
      success: true,
      data: members,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching members" });
  }
};

/**
 * =========================
 * INVITE MEMBER
 * =========================
 */
export const inviteMember = async (req: any, res: any) => {
  try {
    const { workspaceId } = req.params;
    const { userId, role } = req.body;

    const member = await inviteMemberService(workspaceId, userId, role);

    return res.json({
      success: true,
      data: member,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error inviting member" });
  }
};

/**
 * =========================
 * REMOVE MEMBER
 * =========================
 */
export const removeMember = async (req: any, res: any) => {
  try {
    const { workspaceId, userId } = req.params;

    await removeMemberService(workspaceId, userId);

    return res.json({
      success: true,
      message: "Member removed",
    });
  } catch (err) {
    return res.status(500).json({ message: "Error removing member" });
  }
};

/**
 * =========================
 * CHANGE ROLE (FIXED + TOKEN REFRESH)
 * =========================
 */
export const changeRole = async (req: any, res: any) => {
  try {
    const { workspaceId, userId } = req.params;
    const { role } = req.body;

    const result = await changeRoleService(workspaceId, userId, role);

    return res.json({
      success: true,
      message: "Role updated",
      data: result.updated,
      newToken: result.token, // 🔥 important for JWT refresh
    });
  } catch (err) {
    return res.status(500).json({ message: "Error changing role" });
  }
};
