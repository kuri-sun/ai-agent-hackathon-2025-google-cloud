import { User } from "../models/user";
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import { Axios } from "../axios";

const AuthContext = createContext<{
  user: User | null;
  login: () => Promise<void>;
  logOut: () => void;
}>({
  user: null,
  login: async () => {},
  logOut: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const login = async () => {
    try {
      const res = await Axios.get<ApiResponse<User>>("/users/validate", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data.data);
    } catch (err) {
      navigate("/login");
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
