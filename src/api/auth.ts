import { api } from "../lib/apiClient";
import type { User } from "../types/user";

export async function getMe() {
  return api<User | null>("/auth/me");
}

export async function login(email: string, password: string) {
  return api<{ ok: boolean }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout() {
  return api<{ ok: boolean }>("/auth/logout", {
    method: "POST",
  });
}