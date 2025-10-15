const API = import.meta.env.VITE_API_BASE;

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    credentials: "include", // this sends login cookies
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (res.status === 401) throw new Error("UNAUTH"); // not logged in
  if (!res.ok) throw new Error(await res.text());     // other errors

  return res.status === 204
    ? (undefined as T)
    : ((await res.json()) as T);
}