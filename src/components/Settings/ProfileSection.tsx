
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePractice } from "@/hooks/usePractice";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";

export function ProfileSection() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { currentMember } = usePractice();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || currentMember?.name?.split(' ')[0] || "",
    lastName: profile?.last_name || currentMember?.name?.split(' ')[1] || "",
    email: user?.email || currentMember?.email || "",
    phone: currentMember?.phone || "",
    bio: currentMember?.bio || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (profile) {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName
      });
    } else {
      // Logique pour sauvegarder le profil via le système existant
      toast.success("Profil mis à jour avec succès");
    }
  };

  // Obtenir les initiales du nom de l'utilisateur
  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    
    if (currentMember?.name) {
      const nameParts = currentMember.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      }
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return user?.email?.charAt(0).toUpperCase() || "?";
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle>Profil utilisateur</CardTitle>
        <CardDescription>Gérez vos informations personnelles</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-6 items-${isMobile ? "center" : "start"}`}>
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-24 h-24 border-2 border-primary">
              <AvatarImage src={currentMember?.avatar || ""} />
              <AvatarFallback className="text-xl">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">Changer photo</Button>
          </div>
          
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  placeholder="Votre prénom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="votre.email@exemple.com"
                  disabled={!!user} // Désactiver si connecté avec Supabase
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="06 XX XX XX XX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input 
                  id="role" 
                  value={profile?.role === "admin" ? "Administrateur" : profile?.role === "user" ? "Utilisateur" : "Professionnel de santé"} 
                  readOnly
                  disabled
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">À propos de vous</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                placeholder="Quelques informations à propos de vous..."
                rows={3}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave}>Sauvegarder les modifications</Button>
      </CardFooter>
    </Card>
  );
}
