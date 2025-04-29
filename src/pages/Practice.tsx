
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PlusCircle, User, Building, Edit, Trash, Users, UserPlus, Mail, Phone, Map
} from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { usePractice } from "@/hooks/usePractice";
import { toast } from "sonner";

export default function Practice() {
  const { practice, members, addMember, removeMember, updatePractice } = usePractice();
  const [activeTab, setActiveTab] = useState("info");
  const [isNewMemberDialogOpen, setIsNewMemberDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(e.target as HTMLFormElement);
    const newMember = {
      name: formData.get("memberName") as string,
      role: formData.get("memberRole") as string,
      email: formData.get("memberEmail") as string,
      phone: formData.get("memberPhone") as string
    };
    
    // Ajouter le membre
    addMember(newMember);
    setIsNewMemberDialogOpen(false);
    toast.success(`${newMember.name} a été ajouté au cabinet`);
  };
  
  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${memberName} du cabinet ?`)) {
      removeMember(memberId);
      toast.success(`${memberName} a été supprimé du cabinet`);
    }
  };
  
  const handleSavePracticeInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = new FormData(e.target as HTMLFormElement);
    const updatedPractice = {
      name: formData.get("practiceName") as string,
      email: formData.get("practiceEmail") as string,
      phone: formData.get("practicePhone") as string,
      address: formData.get("practiceAddress") as string
    };
    
    // Mettre à jour le cabinet
    updatePractice(updatedPractice);
    setEditMode(false);
    toast.success("Informations du cabinet mises à jour");
  };
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">Administrateur</span>;
      case "nurse":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Infirmier</span>;
      case "secretary":
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Secrétaire</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{role}</span>;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cabinet</h1>
          <p className="text-muted-foreground">Gérez votre cabinet et vos collègues</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Information du cabinet
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                <Edit size={16} className="mr-2" />
                {editMode ? "Annuler" : "Modifier"}
              </Button>
            </CardHeader>
            <CardContent>
              {!practice ? (
                <div className="text-center py-6 text-muted-foreground">
                  Chargement des informations...
                </div>
              ) : (
                <form onSubmit={handleSavePracticeInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="practiceName">Nom du cabinet</Label>
                      <Input 
                        id="practiceName"
                        name="practiceName"
                        defaultValue={practice.name} 
                        readOnly={!editMode} 
                        className={!editMode ? "bg-secondary/20" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="practiceEmail">Email</Label>
                      <Input 
                        id="practiceEmail"
                        name="practiceEmail"
                        type="email" 
                        defaultValue={practice.email}
                        readOnly={!editMode}
                        className={!editMode ? "bg-secondary/20" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="practicePhone">Téléphone</Label>
                      <Input 
                        id="practicePhone"
                        name="practicePhone"
                        defaultValue={practice.phone}
                        readOnly={!editMode}
                        className={!editMode ? "bg-secondary/20" : ""}
                      />
                    </div>
                    <div>
                      <Label htmlFor="practiceAddress">Adresse</Label>
                      <Input 
                        id="practiceAddress"
                        name="practiceAddress"
                        defaultValue={practice.address}
                        readOnly={!editMode}
                        className={!editMode ? "bg-secondary/20" : ""}
                      />
                    </div>
                  </div>
                  
                  {editMode && (
                    <div className="flex justify-end">
                      <Button type="submit">
                        Enregistrer les modifications
                      </Button>
                    </div>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Aperçu des membres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div 
                    key={member.id}
                    className="border rounded-lg p-4 flex flex-col items-center text-center space-y-2"
                  >
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <div className="mt-1">{getRoleBadge(member.role)}</div>
                    </div>
                  </div>
                ))}
                
                <Dialog open={isNewMemberDialogOpen} onOpenChange={setIsNewMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-full min-h-[120px] border-dashed flex flex-col items-center justify-center gap-2"
                    >
                      <UserPlus size={24} />
                      <span>Ajouter un membre</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau membre</DialogTitle>
                      <DialogDescription>
                        Ajoutez un nouveau membre à votre cabinet
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddNewMember} className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="memberName">Nom complet</Label>
                        <Input id="memberName" name="memberName" placeholder="Jean Dupont" required />
                      </div>
                      <div>
                        <Label htmlFor="memberRole">Rôle</Label>
                        <select 
                          id="memberRole" 
                          name="memberRole"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        >
                          <option value="nurse">Infirmier</option>
                          <option value="secretary">Secrétaire</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="memberEmail">Email</Label>
                        <Input id="memberEmail" name="memberEmail" type="email" placeholder="jean.dupont@exemple.com" required />
                      </div>
                      <div>
                        <Label htmlFor="memberPhone">Téléphone</Label>
                        <Input id="memberPhone" name="memberPhone" placeholder="06 12 34 56 78" required />
                      </div>
                      <DialogFooter>
                        <Button type="submit">Ajouter</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Membres du cabinet
              </CardTitle>
              <Button onClick={() => setIsNewMemberDialogOpen(true)}>
                <PlusCircle size={16} className="mr-2" />
                Ajouter un membre
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </TableCell>
                      <TableCell>{getRoleBadge(member.role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Mail size={14} className="text-muted-foreground" />
                          {member.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <button 
                          className="flex items-center gap-1 hover:text-primary hover:underline"
                          onClick={() => window.location.href = `tel:${member.phone.replace(/\s/g, '')}`}
                          title="Appeler ce membre"
                        >
                          <Phone size={14} className="text-muted-foreground" />
                          {member.phone}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit size={16} className="mr-2" />
                            Modifier
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id, member.name)}
                          >
                            <Trash size={16} className="mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
