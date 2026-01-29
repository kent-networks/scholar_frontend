"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, RegisterData, User } from "@/lib/api/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role: "student" | "educator" | "creator" | "admin";
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await authApi.login({ email, password });
      if (response.success) {
        setUser(response.data.user);
        router.push("/");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }

  async function register(data: {
    email: string;
    password: string;
    name: string;
    role: "student" | "educator" | "creator" | "admin";
  }) {
    try {
      // Frontend API type currently doesn't include "admin" as a register role.
      // If "admin" is passed, fall back to "student" to avoid breaking registration flow.
      let safeData: RegisterData;
      if (data.role === "admin") {
        safeData = { ...data, role: "student" };
      } else {
        safeData = data as RegisterData;
      }
      const response = await authApi.register(safeData);
      if (response.success) {
        setUser(response.data.user);
        router.push("/");
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  }

  async function logout() {
    try {
      await authApi.logout();
      setUser(null);
      router.push("/");
    } catch (error: any) {
      // Even if logout fails, clear local state
      setUser(null);
      router.push("/");
    }
  }

  async function refreshUser() {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

