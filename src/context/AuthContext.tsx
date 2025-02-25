"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextProps {
  originalPage: string;
  setOriginalPage: (page: string) => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [originalPage, setOriginalPage] = useState("/");

  return (
    <AuthContext.Provider value={{ originalPage, setOriginalPage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
