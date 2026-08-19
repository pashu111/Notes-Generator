// src/api/auth.js
//
// Email/password + session helpers. All requests are same-origin through the
// Vite proxy, and cookies (httpOnly JWT) are sent with `credentials: include`.

const request = async (url, options = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
  }

  return data;
};

export const registerApi = (payload) =>
  request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const loginApi = (payload) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const logoutApi = () => request("/api/auth/logout", { method: "GET" });