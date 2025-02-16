import { IconType } from "react-icons";
import { IoChevronDown } from "react-icons/io5";

type SidebarItem = {
  label: string;
  path?: string;
  icon?: IconType;
  children?: SidebarItem[];
};

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useLocation } from "react-router-dom";

const AppTree = ({ item }: { item: SidebarItem }) => {
  const location = useLocation(); // Get the current location
  const isActive = item.path && location.pathname.startsWith(item.path); // Check if the route is active

  const Icon = item.icon || IoChevronDown;
  //  If there are no children
  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link
            to={item.path as string}
            className={`flex items-center gap-2 ${
              isActive
                ? "text-blue-500 font-bold bg-white rounded-md p-2"
                : "text-gray-"
            }`}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // If there are children
  return (
    <SidebarMenuItem>
      <Collapsible>
        <CollapsibleTrigger className="group/collapsible" asChild>
          <SidebarMenuButton
            className={`w-full `}
          >
            <Icon className="mr-2 h-4 w-4" />
            <p>{item.label}</p>
            <IoChevronDown className="ml-auto h-4 w-4 transition-transform duration-500 group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children.map((subItem, index) => (
              <AppTree key={index} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );

  
};

export default AppTree;
