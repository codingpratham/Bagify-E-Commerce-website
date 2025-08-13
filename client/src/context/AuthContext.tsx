/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext ,useState } from "react";
import axios from "axios";

interface User {
  email: string;
  name: string;
  password: string;
  role: "USER" | "ADMIN";
  isOnBoarded : boolean;
}

interface AuthContextType {
  isOnBoarded: boolean;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  register: (user: User) => Promise<void>;
  setIsOnBoarded: (isOnBoarded: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOnBoarded, setIsOnBoarded] = useState(false);


  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);
      setIsOnBoarded(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (user: User) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setIsAuthenticated(true);
      setIsOnBoarded(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/logout`);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isOnBoarded,user, login, register, logout, isAuthenticated, loading , setIsOnBoarded }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
