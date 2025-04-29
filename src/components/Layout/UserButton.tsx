
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/hooks/useProfile";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

export const UserButton = () => {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    // Simuler une déconnexion
    toast.success("Déconnexion réussie");
    // Redirection vers la page d'accueil
    navigate('/');
  };
  
  const goToSettings = () => {
    navigate('/settings');
  };
  
  const initials = profile ? 
    `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}` : 
    'IN';
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src={profile?.first_name ? "" : ""} alt={profile?.first_name || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={goToSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Paramètres</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
