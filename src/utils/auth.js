export const AUTH_TOKEN_KEY = "file_management_token"

export const setAuthToken = (token) => {
  if (typeof window !== "undefined" && token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const clearAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }
}

function decodeBase64(value) {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    return atob(padded)
  } catch {
    return null
  }
}

export function parseJwt(token) {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const payload = decodeBase64(parts[1])
  if (!payload) return null

  try {
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function getUserFromToken() {
  const token = getAuthToken()
  if (!token) return null

  const payload = parseJwt(token)
  if (!payload) return null

  const roles =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload.role ||
    []

  return {
    id: payload.sub || null,
    userName: payload.unique_name || payload.name || payload.userName || "",
    email: payload.email || payload.Email || "",
    roles: Array.isArray(roles) ? roles : [roles].filter(Boolean),
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  };
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  if (!token) return {}
  return {
    Authorization: `Bearer ${token}`,
  }
}
