import { createContext, useEffect, useMemo, useState } from "react";
import { clearAuth, loadAuth, saveAuth } from "../utils/storage";
import { loginUser } from "../services/authService";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => loadAuth());

  useEffect(() => {
    if (auth) saveAuth(auth);
  }, [auth]);

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    const authValue = { token: result.token, user: result.user };
    setAuth(authValue);
    saveAuth(authValue);
    return authValue;
  };

  const logout = () => {
    setAuth(null);
    clearAuth();
  };

  const value = useMemo(
    () => ({
      token: auth?.token || null,
      user: auth?.user || null,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
