async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

export const api = {
  getSaves: () => request<{ saves: { illustration_slug: string; created_at: string }[] }>("/saves"),
  addSave: (slug: string) => request<{ ok: true }>("/saves", { method: "POST", body: JSON.stringify({ slug }) }),
  removeSave: (slug: string) => request<{ ok: true }>(`/saves/${slug}`, { method: "DELETE" }),
  subscribeNewsletter: (email: string) =>
    request<{ ok: true }>("/newsletter", { method: "POST", body: JSON.stringify({ email }) }),
};
