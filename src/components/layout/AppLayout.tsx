
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  List, 
  MessageSquare, 
  User, 
  Bell, 
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: List,
      active: location.pathname === "/dashboard"
    },
    {
      name: "Chat",
      href: "/chat",
      icon: MessageSquare,
      active: location.pathname === "/chat"
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: Bell,
      active: location.pathname === "/achievements"
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      active: location.pathname === "/profile"
    }
  ];

  if (isAdmin) {
    navigationItems.unshift({
      name: "Admin",
      href: "/admin",
      icon: Settings,
      active: location.pathname === "/admin"
    });
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="bg-sidebar border-r border-border">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
                  TT
                </div>
                <span className="font-bold text-lg">Task Trophy</span>
              </Link>
            </div>
          
            <SidebarContent className="flex-1 py-4">
              <nav className="px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium group transition-colors ${
                      item.active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </SidebarContent>
            
            <div className="p-4 border-t mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} />
                    <AvatarFallback>{currentUser ? getInitials(currentUser.name) : "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Sidebar>
        
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
            <SidebarTrigger />
            <div></div>
          </header>
          
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
