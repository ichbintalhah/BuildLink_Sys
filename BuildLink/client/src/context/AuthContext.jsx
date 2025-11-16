import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      API.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const authValue = { user, setUser, token, setToken, loading };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
