import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Users } from "lucide-react";

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
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
];

const groupLabels = {
  main: "Main",
  account: "Account",
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarHeader className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-center py-2">
          <img src="/logos/logo.svg" alt="App Logo" className="h-8 w-auto" />
        </div>
      </SidebarHeader>

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
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isActive(item.url)
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Logout Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors duration-200 text-gray-700 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-200"
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0 text-gray-400" />
                    <span className="font-medium">Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
