import { createContext, useContext, useState } from "react";
import { authApi } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(authApi.isAuthenticated());

  async function login(username, password) {
    await authApi.login(username, password);
    setIsAuthed(true);
  }

  function logout() {
    authApi.logout();
    setIsAuthed(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
