import { api } from "@/lib/api";

export const loginUser = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", data);
  localStorage.setItem("accessToken", res.data.accessToken);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
  }
};
