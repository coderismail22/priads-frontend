import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import AppTree from "./AppTree";
import { sidebarData } from "@/constants/sidebarData";
import { Role } from "./dashboard.type";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

export const AppSidebar = ({
  role,
  ...props
}: { role: Role } & React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarContent className="bg-gradient-to-b from-blue-500 to-cyan-600 text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarData[role].map((item, index) => (
                <AppTree key={index} item={item} />
              ))}
              {/* Go to Home For All*/}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/" className={`flex items-center gap-2`}>
                    <FaArrowLeftLong className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
