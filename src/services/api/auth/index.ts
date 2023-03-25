import { api } from "..";

export const login = async (email: string, password: string) => {
  return await api.post("/auth/login", { email, password });
};
