import { createContext, useContext, useState } from "react";
import api from "./api";

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const persist = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };
  const login = async (body) => persist((await api.post("/auth/login/", body)).data);
  const register = async (body) => persist((await api.post("/auth/register/", body)).data);
  const logout = async () => {
    try { await api.post("/auth/logout/"); } catch { /* token may already be invalid */ }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, register, logout }}>{children}</Ctx.Provider>;
}
