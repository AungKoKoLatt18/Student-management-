import { createContext, useCallback, useContext, useState } from "react";
import { loginRequest } from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token ? { token, username } : null;
  });

  const login = async (username, password) => {
    const data = await loginRequest(username, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    setUser({ token: data.token, username: data.username });
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);