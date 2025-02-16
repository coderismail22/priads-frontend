import { Role } from "@/components/DashboardAndSidebar/dashboard.type";
import RoleProtectedRoute from "../RoleWrapper/RoleWrapper";
type RoleBasedWrapperProps = {
  allowedRoles: Role[]; // Roles allowed for this wrapper
  children: JSX.Element; // Component to render if checks pass
};
const StudentRouteWrapper = ({ children }: RoleBasedWrapperProps) => {
  return (
    <RoleProtectedRoute allowedRoles={["student"]}>
      {children}
    </RoleProtectedRoute>
  );
};

export default StudentRouteWrapper;
