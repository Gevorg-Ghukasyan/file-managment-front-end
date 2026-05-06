import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/AuthService";
import { clearAuthToken, getAuthToken, getUserFromToken, setAuthToken } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getAuthToken());
  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    setUser(getUserFromToken());
  }, [token]);

  const login = async ({ userNameOrEmail, password }) => {
    const data = await authService.login({ userNameOrEmail, password });
    setAuthToken(data.token);
    setToken(data.token);
    return data;
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      roles: user?.roles || [],
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
