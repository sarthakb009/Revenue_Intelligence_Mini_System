const API_BASE = "/api";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(res.statusText || `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}
