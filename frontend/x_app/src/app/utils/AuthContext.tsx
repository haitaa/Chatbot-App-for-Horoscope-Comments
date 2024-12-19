"use client";

import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  profile: string | null;
  bio: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // localStorage'dan token ve kullanıcı bilgilerini al
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      setToken(storedToken); // Token'i state'e kaydet
      setUser(JSON.parse(storedUser)); // Sadece kullanıcı bilgilerini state'e kaydet
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await axios.post(
        "http://localhost:8000/auth/token",
        formData,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      const accessToken = response.data.access_token;
      const user = response.data.user; // Kullanıcı verilerini al

      // Token'i ve kullanıcı bilgilerini ayrı sakla
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setToken(accessToken); // Token'i state'e kaydet
      setUser(user); // Kullanıcı bilgilerini state'e kaydet
      setIsAuthenticated(true);
      router.push("/home");
    } catch (error) {
      console.error("Login Failed:", error);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
