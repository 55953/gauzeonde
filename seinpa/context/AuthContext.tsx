import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState } from "../types";
import { getToken, setToken, clearToken, parseUser, isAuthenticated } from "../auth/auth";

type AuthContextType = {
  authState?: AuthState;
  login: (token: string) => void;
  logout: () => void;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextType>({
  authState: { token: null, authenticated: null },
  login: () => {},
  logout: () => {},
  refresh: () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: any ) {
  const [authState, setAuthState] = useState<AuthState>({
        token: null,
        authenticated: null
    });
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (isAuth) {
        const token = (await getToken()) as string;
        setAuthState({ token, authenticated: isAuth });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    checkAuth();
  }, []);

  const login = (tokenValue: string) => {
    setToken(tokenValue);
    const isAuth = isAuthenticated();
    if (!isAuth) {
      console.error("Failed to authenticate with token:", tokenValue);
      return;
    }
    setAuthState({ token: tokenValue, authenticated: true });
  };

  const logout = () => {
    clearToken();
    setAuthState({ token: null, authenticated: false });
  };

  const refresh = async () => {
    const tk = await getToken();
    setAuthState({ token: tk, authenticated: !!tk });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
