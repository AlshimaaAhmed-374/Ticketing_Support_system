import { authApi } from "../api/axiosClient";

export const registerUser = async (payload) => {
  const { data } = await authApi.post("/auth/register", payload);
  return data.data;
};

export const loginUser = async (payload) => {
  const { data } = await authApi.post("/auth/login", payload);
  return data.data;
};

export const fetchAgents = async () => {
  const { data } = await authApi.get("/auth/users/agents");
  return data.data;
};
