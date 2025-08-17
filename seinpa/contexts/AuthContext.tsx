import React, { use, createContext, useContext, useState, useEffect, type PropsWithChildren } from "react";
import { TokenPayload, User, Session} from "../types";
import { jwtDecode } from "jwt-decode";
import { getToken, setToken, clearToken, parseUser, isAuthenticated } from "../auth/auth";
import { DriverApi, setAuthToken } from "@api/api";

interface AuthContextType {
  session: { token: string | null; user: User | null };
  isLoggedIn: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refresh: () => void;
  setSession: (token: string | null, user: User | null) => void;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: any }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!session?.user;
  useEffect(() => {
    // Check for stored authentication on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await getToken();
      console.log("Stored token:", storedToken);
      if (storedToken) {
        const user = await parseUser(storedToken) as Partial<User>;
        setSession({ token: storedToken, user: user as User });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
      const userdata = jwtDecode<Partial<TokenPayload>>(token);
      if (!userdata || !userdata?.user) {
        throw new Error("Invalid token payload");
      } 
      setToken(token);
      console.log("User data from token:", userdata?.user);
      setSession({ token, user: userdata?.user });
  };

  const logout = () => {
    clearToken();
    setSession({ session: null, user: null });
    // router.replace("/");
  };

  const refresh = async () => {
    const tk = await getToken();
    setSession({ session: tk, user: parseUser(tk) as Partial<User> });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        session,
        isLoggedIn,
        login, 
        logout, 
        refresh, 
        isLoading 
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useSession() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSession must be used within an AuthProvider');
  }
  return context;
}