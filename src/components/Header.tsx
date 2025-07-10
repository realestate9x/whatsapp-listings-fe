import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const name =
    (user?.identities?.[0]?.identity_data?.contact_name as string) ||
    user?.user_metadata?.name ||
    "User";

  const email = user?.email || user?.user_metadata?.email || "";

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error signing out");
        return;
      }
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200" />
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="ring-2 ring-blue-200 hover:ring-blue-300 transition-all duration-200 cursor-pointer">
              {/* If you have a user image, use AvatarImage. Otherwise, fallback to initials. */}
              {user?.user_metadata?.avatar_url ? (
                <AvatarImage src={user.user_metadata.avatar_url} alt={name} />
              ) : (
                <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                  {name?.[0] || "U"}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-lg border border-gray-200 bg-white shadow-lg p-2 mt-2"
          >
            <DropdownMenuLabel className="p-0 mb-2">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                  {user?.user_metadata?.avatar_url ? (
                    <AvatarImage
                      src={user.user_metadata.avatar_url}
                      alt={name}
                    />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {name?.[0] || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {name}
                  </span>
                  <span className="text-xs text-gray-500">{email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-gray-200" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="rounded-md px-2 py-2 text-gray-700 font-medium hover:bg-red-50 hover:text-red-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-gray-400" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
