import { useLogout } from "@/hooks/useLogout";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(); // Trigger the logout process
  };

  return (
    <Button className="bg-gradient-to-tr from-[#6a82fb] to-[#fc5c7d]  hover:from-[#fc5c7d] hover:to-[#6a82fb]" onClick={handleLogout} disabled={logoutMutation.isPending}>
      <LogOut />
      {logoutMutation.isPending ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
