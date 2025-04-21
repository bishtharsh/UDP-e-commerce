import React, { createContext, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import ROUTES from "../navigations/Routes";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = (userToken) => {
    setToken(userToken); // Store token in memory
    localStorage.setItem("userToken", JSON.stringify(token));
    <Navigate to="/home" />; // Redirect after login
  };

  const logout = () => {
    setToken(null);
    localStorage.setItem("userToken", JSON.stringify(token));
    <Navigate to="/login" />; // Redirect after logout
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
