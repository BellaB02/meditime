
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TemporaryAccessService } from "@/services/TemporaryAccessService";

interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string; // Add bio property as optional
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
    phone: member?.phone || "",
    bio: member?.bio || "" // Add bio to form data
  });
  const [isSending, setIsSending] = useState(false);

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
    
    setIsSending(true);

    if (member) {
      // Mise à jour d'un membre existant
      onSave({
        ...member,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio // Include bio in the update
      });
      setIsSending(false);
      onClose();
    } else {
      // Nouveau membre - création et envoi d'un email d'invitation
      const newMember = {
        id: `member-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio, // Include bio for new members
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name.split(' ')[0]}`
      };
      
      // Générer un lien d'accès temporaire
      const { id, link } = TemporaryAccessService.generateTemporaryAccess(
        formData.email,
        formData.role,
        formData.name,
        72 // 72 heures de validité
      );
      
      // Simuler l'envoi d'un email (dans une application réelle, vous utiliseriez un service d'email)
      setTimeout(() => {
        console.log(`Email d'invitation envoyé à ${formData.email} avec le lien: ${link}`);
        toast.success(`Invitation envoyée à ${formData.email}`);
        onSave(newMember);
        setIsSending(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
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
              <SelectTrigger id="role" className="w-full">
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
          
          <div className="space-y-2">
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              placeholder="Quelques informations sur le membre..."
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? 'Envoi en cours...' : member ? "Enregistrer" : "Ajouter et inviter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
