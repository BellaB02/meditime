
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, LogOut } from "lucide-react";
import { useSidebar } from "./SidebarProvider";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { usePractice } from "@/hooks/usePractice";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProfile } from "@/hooks/useProfile";

export function Header() {
  const { toggleSidebar } = useSidebar();
  const [notifications, setNotifications] = useState<number>(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { profile } = useProfile();
  const { currentMember } = usePractice();
  const isMobile = useIsMobile();
  
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
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      // Erreur déjà gérée dans le contexte d'authentification
    }
  };
  
  const handleProfileClick = () => {
    navigate('/settings');
  };

  // Obtenir le nom complet ou les initiales de l'utilisateur
  const getUserDisplayName = () => {
    if (profile) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || "Utilisateur";
    }
    
    if (currentMember) {
      return currentMember.name;
    }
    
    return user?.email?.split('@')[0] || "Utilisateur";
  };
  
  // Obtenir les initiales du nom de l'utilisateur
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    
    if (currentMember) {
      const nameParts = currentMember.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return user?.email?.charAt(0).toUpperCase() || "?";
  };
  
  return (
    <header className="h-16 px-4 border-b flex items-center justify-between bg-background shadow-sm">
      <div className="flex items-center gap-2 lg:gap-4 w-full">
        {!isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
        )}
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/f32c5bf3-0b98-449e-8874-7a5665e67228.png" 
            alt="Meditime Logo" 
            className="h-8 w-8 mr-2" 
          />
          <h1 className="text-xl font-semibold text-primary">Meditime Pro</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
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
        
        {!isMobile && (
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {getUserDisplayName()}
          </span>
        )}
        
        <Button variant="ghost" size="icon" onClick={handleLogout} className="md:mr-2">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Se déconnecter</span>
        </Button>
        
        <Avatar className="cursor-pointer" onClick={handleProfileClick}>
          <AvatarImage src={currentMember?.avatar || ""} />
          <AvatarFallback>{getUserInitials()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
