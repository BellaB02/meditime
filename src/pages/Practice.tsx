
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, UserPlus, MapPin, Phone, Mail } from "lucide-react";
import { usePractice } from "@/hooks/usePractice";
import { EditMemberDialog } from "@/components/practice/EditMemberDialog";
import { TemporaryAccessLinks } from "@/components/practice/TemporaryAccessLinks";
import { toast } from "sonner";

export default function Practice() {
  const { 
    practice, 
    members, 
    updatePractice, 
    addMember, 
    removeMember,
    updateMember 
  } = usePractice();
  
  const [isEditPracticeDialogOpen, setIsEditPracticeDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  
  // Determine if current user is an admin (for demo purposes, assume users with role=admin are admins)
  const isAdmin = true; // In a real app, this would come from authentication
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'nurse':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'nurse':
        return 'Infirmier(ère)';
      case 'secretary':
        return 'Secrétaire';
      default:
        return 'Autre';
    }
  };
  
  const handleAddMember = () => {
    setCurrentMember(null);
    setIsAddMemberDialogOpen(true);
  };
  
  const handleEditMember = (member: any) => {
    setCurrentMember(member);
    setIsEditMemberDialogOpen(true);
  };
  
  const handleSaveMember = (member: any) => {
    if (currentMember) {
      // Update existing member
      updateMember(member.id, member);
      toast.success(`Les informations de ${member.name} ont été mises à jour`);
    } else {
      // Add new member
      addMember(member);
      toast.success(`${member.name} a été ajouté(e) à l'équipe`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cabinet</h1>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="access">Accès temporaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{practice.name}</CardTitle>
                <CardDescription>Informations générales du cabinet</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditPracticeDialogOpen(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="text-primary h-4 w-4" />
                  <span>{practice.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-primary h-4 w-4" />
                  <span>{practice.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-primary h-4 w-4" />
                  <span>{practice.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>Équipe</CardTitle>
                <CardDescription>Membres du cabinet</CardDescription>
              </div>
              <Button onClick={handleAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter un membre
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {members.map(member => (
                  <div key={member.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary font-bold">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {getRoleDisplayName(member.role)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1 w-full sm:w-auto">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{member.email}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex justify-end mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditMember(member)}
                          >
                            <Pencil className="h-3 w-3 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {members.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun membre dans l'équipe
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="access" className="space-y-4">
          {isAdmin ? (
            <TemporaryAccessLinks />
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <h3 className="text-lg font-medium">Accès limité</h3>
                <p className="text-muted-foreground">
                  Seuls les administrateurs peuvent gérer les accès temporaires.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <EditMemberDialog 
        isOpen={isAddMemberDialogOpen || isEditMemberDialogOpen}
        onClose={() => {
          setIsAddMemberDialogOpen(false);
          setIsEditMemberDialogOpen(false);
        }}
        onSave={handleSaveMember}
        member={currentMember}
      />
    </div>
  );
}
