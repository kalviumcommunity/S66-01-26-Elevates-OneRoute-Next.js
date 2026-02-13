"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Role, normalizeRole } from "@/config/roles";

export interface AuthUser {
  name: string;
  email?: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

const STORAGE_KEY = "oneroute.auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const login = (authUser: AuthUser) => {
    setUser(authUser);
    persistUser(authUser);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const setRole = (role: Role) => {
    setUser((current) => {
      if (!current) {
        return current;
      }
      const updatedUser = { ...current, role };
      persistUser(updatedUser);
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }
    const parsed = JSON.parse(stored) as AuthUser;
    const normalizedRole = normalizeRole(parsed.role);
    if (!normalizedRole) {
      return null;
    }
    return { ...parsed, role: normalizedRole };
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
