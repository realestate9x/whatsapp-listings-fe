import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Building } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: "main",
  },
  {
    title: "Groups",
    url: "/dashboard/groups",
    icon: Users,
    group: "main",
  },
  {
    title: "Properties",
    url: "/dashboard/properties",
    icon: Building,
    group: "main",
  },
];

const groupLabels = {
  main: "Main",
  account: "Account",
};

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return (
        currentPath === "/dashboard" ||
        (currentPath === "/" && path === "/dashboard")
      );
    }
    return currentPath === path || currentPath.startsWith(path + "/");
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarContent className="px-4 py-6">
        {/* Main Navigation */}
        {Object.entries(groupedItems).map(([groupKey, items]) => (
          <SidebarGroup key={groupKey} className="mb-6">
            <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
              {groupLabels[groupKey as keyof typeof groupLabels]}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                          isActive(item.url)
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
