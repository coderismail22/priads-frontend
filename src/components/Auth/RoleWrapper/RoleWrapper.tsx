import { useQueryClient } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { authKey } from "@/api/authKey";
import { Role } from "@/components/DashboardAndSidebar/dashboard.type";

type RoleWrapperProps = {
  allowedRoles: Role[]; // Roles allowed for this wrapper
  children: JSX.Element; // Component to render if checks pass
  fallback?: JSX.Element; // Optional fallback component while checking permissions
};

const RoleWrapper = ({
  allowedRoles,
  children,
  fallback,
}: RoleWrapperProps) => {
  const queryClient = useQueryClient();
  const authData = queryClient.getQueryData<{
    accessToken: string;
    role: Role;
  }>(authKey);

  // Show fallback (e.g., loader) while waiting for auth data
  if (!authData) {
    return fallback || <p>Loading...</p>;
  }

  // Redirect to login if no valid auth data exists
  if (!authData.accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect to unauthorized page if role is not allowed
  if (!allowedRoles.includes(authData.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the wrapped component if all checks pass
  return children;
};

export default RoleWrapper;
