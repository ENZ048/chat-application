import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import Cookie from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/user/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };

    if (Cookie.get("token")) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
