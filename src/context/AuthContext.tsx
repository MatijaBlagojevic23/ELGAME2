"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [originalPage, setOriginalPage] = useState("/");

  return (
    <AuthContext.Provider value={{ originalPage, setOriginalPage }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
