/**
 * Server-side fetch helper for React Server Components.
 * Always no-store: admin edits must show up on the next refresh.
 */
const API_URL = process.env.API_URL ?? "http://localhost:4000";

export async function serverApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}
