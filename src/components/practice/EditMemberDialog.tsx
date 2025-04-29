
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface EditMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Member) => void;
  member?: Member;
}

export const EditMemberDialog = ({ isOpen, onClose, onSave, member }: EditMemberDialogProps) => {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    role: member?.role || "nurse",
    email: member?.email || "",
    phone: member?.phone || ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    // Valider le format email
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Format d'email invalide");
      return;
    }
    
    // Valider le format de téléphone (simplifié)
    if (!/^[\d\s]{10,}$/.test(formData.phone)) {
      toast.error("Format de numéro de téléphone invalide");
      return;
    }
    
    if (member) {
      // Mise à jour d'un membre existant
      onSave({
        ...member,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone
      });
    } else {
      // Nouveau membre
      onSave({
        id: `member-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.split(' ')[0]}`
      });
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {member ? "Modifier le membre" : "Ajouter un nouveau membre"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Jean Dupont"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
            <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Sélectionnez un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrateur</SelectItem>
                <SelectItem value="nurse">Infirmier</SelectItem>
                <SelectItem value="secretary">Secrétaire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Ex: jean.dupont@cabinet-infirmier.fr"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Ex: 06 12 34 56 78"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {member ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
