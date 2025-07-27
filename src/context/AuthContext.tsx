import React, { createContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  role: string | null;
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  setAuth: (auth: { token: string; role: string; username: string }) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage (once)
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    const storedUsername = localStorage.getItem("userName");

    if (storedToken && storedRole && storedUsername) {
      setToken(storedToken);
      setRole(storedRole);
      setUsername(storedUsername);
    }
    setLoading(false); // Done loading
  }, []);

  const setAuth = (auth: { token: string; role: string; username: string }) => {
    setToken(auth.token);
    setRole(auth.role);
    setUsername(auth.username);
    localStorage.setItem("token", auth.token);
    localStorage.setItem("userRole", auth.role);
    localStorage.setItem("userName", auth.username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        username,
        isAuthenticated: !!token,
        loading,
        setAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
