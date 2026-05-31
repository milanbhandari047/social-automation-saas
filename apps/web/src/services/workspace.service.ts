import { api } from "@/lib/api";

export const getWorkspaces = async () => {
  const res = await api.get("/workspaces");
  return res.data.data ?? res.data;
};

export const getWorkspaceById = async (workspaceId: string) => {
  const res = await api.get(`/workspaces/${workspaceId}`);
  return res.data;
};

export const createWorkspace = async (name: string) => {
  const res = await api.post("/workspaces", { name });
  return res.data.data ?? res.data;
};

// GET members
export const getMembers = async (workspaceId: string) => {
  const res = await api.get(`/members/${workspaceId}`);
  return res.data.data; // ← backend returns { success, data }
};

// INVITE member — backend takes userId not email
export const inviteMember = async (
  workspaceId: string,
  userId: string,
  role: string
) => {
  const res = await api.post(`/members/${workspaceId}/invite`, {
    userId,
    role,
  });
  return res.data;
};

// REMOVE member
export const removeMember = async (workspaceId: string, userId: string) => {
  const res = await api.delete(`/members/${workspaceId}/members/${userId}`);
  return res.data;
};

// CHANGE ROLE
export const changeMemberRole = async (
  workspaceId: string,
  userId: string,
  role: string
) => {
  const res = await api.patch(
    `/members/${workspaceId}/members/${userId}/role`,
    { role }
  );
  return res.data;
};

// SEARCH USER BY EMAIL
export const searchUserByEmail = async (email: string) => {
  const res = await api.get(`/users/search?email=${email}`);
  return res.data.data;
};

// UPDATE WORKSPACE NAME
export const updateWorkspace = async (workspaceId: string, name: string) => {
  const res = await api.put(`/workspaces/${workspaceId}`, { name });
  return res.data.data;
};
// DELETE WORKSPACE
export const deleteWorkspace = async (workspaceId: string) => {
  const res = await api.delete(`/workspaces/${workspaceId}`);
  return res.data;
};
