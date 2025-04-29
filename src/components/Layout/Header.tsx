
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, LogOut } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useContext } from "react";
import { AuthContext } from "../../App";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const [notifications, setNotifications] = useState<number>(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  
  useEffect(() => {
    // Simuler la réception de notifications
    const timer = setTimeout(() => {
      setNotifications(3);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNotificationClick = () => {
    setShowNotificationPanel(!showNotificationPanel);
    setNotifications(0);
    
    if (!showNotificationPanel) {
      toast({
        title: "Notifications vérifiées",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
  };
  
  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background">
      <div className="flex items-center gap-2 lg:gap-4 w-full">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="hidden lg:flex">
          <h1 className="text-xl font-semibold">Meditime</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={handleNotificationClick}>
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
        
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Se déconnecter</span>
        </Button>
        
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
