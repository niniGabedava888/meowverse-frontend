const API_URL = import.meta.env.VITE_API_URL;

export async function http<T>(
  path: String,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(API_URL + path, { ...options, headers });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const error = await response.json();
      message = error.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
