import api from "./api";
import Cookies from "js-cookie";
import type { LoginPayload, LoginResponse, User } from "@/types";

export async function login(payload: LoginPayload): Promise<{ user: User }> {
  const { data } = await api.post<LoginResponse>("/auth/token/", payload);

  Cookies.set("access_token", data.access, { expires: 1 });
  Cookies.set("refresh_token", data.refresh, { expires: 7 });

  const user = await fetchCurrentUser();
  return { user };
}

export async function logout(): Promise<void> {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (refreshToken) {
      await api.post("/auth/logout/", { refresh: refreshToken });
    }
  } catch {
    // Ignore logout API errors
  } finally {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
  }
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me/permissions/");
  return data;
}
