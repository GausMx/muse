import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = localStorage.getItem("admin");
      if (!stored || stored === "undefined") return null; // ✅ Check for "undefined" string
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing admin from localStorage:", error);
      return null;
    }
  });

  const login = async (data) => {
    if (!data.token || !data.user) {
      console.error("Invalid login data:", data);
      return;
    }
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.user));
    setAdmin(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
};