import { AUTH_API } from "../config";

async function requestJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || payload?.title || response.statusText || "Request failed";
    throw new Error(message);
  }

  return payload;
}

export const authService = {
  login: async ({ userNameOrEmail, password }) => {
    return requestJson(`${AUTH_API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userNameOrEmail, password }),
    });
  },

  register: async ({ userName, email, firstName, lastName, password }) => {
    const response = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, email, firstName, lastName, password }),
    });

    if (response.status === 201) {
      return;
    }

    const payload = await response.json().catch(() => null);
    const message = payload?.message || payload?.title || response.statusText || "Registration failed";
    throw new Error(message);
  },
};
