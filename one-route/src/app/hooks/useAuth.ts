import { useAuthContext } from "../context/AuthContext";
import { Permission, hasPermission } from "@/config/roles";

export const useAuth = () => {
  const context = useAuthContext();
  const role = context.user?.role ?? null;

  return {
    user: context.user,
    role,
    isAuthenticated: !!context.user,
    login: context.login,
    logout: context.logout,
    setRole: context.setRole,
    can: (permission: Permission) => hasPermission(role, permission),
  };
};