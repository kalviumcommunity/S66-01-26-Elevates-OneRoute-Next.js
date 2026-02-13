import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    user: context.user,
    isAuthenticated: !!context.user,
    login: context.login,
    logout: context.logout
  };
};