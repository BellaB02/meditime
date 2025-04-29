
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Clock, Copy, Link, X } from "lucide-react";
import { toast } from "sonner";
import { TemporaryAccessService } from "@/services/TemporaryAccessService";

export const TemporaryAccessLinks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("nurse");
  const [duration, setDuration] = useState("24");
  const [activeLinks, setActiveLinks] = useState(TemporaryAccessService.getActiveAccessLinks());
  const [generatedLink, setGeneratedLink] = useState("");
  
  const handleGenerateLink = () => {
    if (!email || !name || !role || !duration) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    
    const { link } = TemporaryAccessService.generateTemporaryAccess(
      email,
      role,
      name,
      parseInt(duration)
    );
    
    setGeneratedLink(link);
    
    // Refresh active links list
    setActiveLinks(TemporaryAccessService.getActiveAccessLinks());
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    toast.success("Lien copié dans le presse-papiers");
  };
  
  const handleRevokeLink = (id: string) => {
    TemporaryAccessService.revokeAccess(id);
    setActiveLinks(TemporaryAccessService.getActiveAccessLinks());
    toast.success("Lien d'accès révoqué");
  };
  
  const formatExpiryDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTimeLeft = (expiryDate: Date) => {
    const now = new Date();
    const diff = expiryDate.getTime() - now.getTime();
    
    // Convertir en heures et minutes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    
    return `${minutes}min`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liens d'accès temporaires</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>Générer un lien</Button>
      </CardHeader>
      <CardContent>
        {activeLinks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Aucun lien d'accès temporaire actif
          </div>
        ) : (
          <div className="space-y-4">
            {activeLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">{link.name}</div>
                  <div className="text-sm text-muted-foreground">{link.email}</div>
                  <div className="text-xs flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    Expire dans {getTimeLeft(link.expires)} ({formatExpiryDate(link.expires)})
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRevokeLink(link.id)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Révoquer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer un lien d'accès temporaire</DialogTitle>
            <DialogDescription>
              Créez un lien d'accès temporaire pour permettre à un remplaçant d'accéder au cabinet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nom du remplaçant</Label>
                <Input
                  id="name"
                  placeholder="Ex: Jean Dupont"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: jean.dupont@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select value={role} onValueChange={setRole}>
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
                <div>
                  <Label htmlFor="duration">Durée (heures)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Sélectionnez une durée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 heures</SelectItem>
                      <SelectItem value="8">8 heures</SelectItem>
                      <SelectItem value="24">24 heures</SelectItem>
                      <SelectItem value="48">48 heures</SelectItem>
                      <SelectItem value="72">72 heures</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {generatedLink && (
              <div className="p-3 bg-primary/10 rounded-md">
                <div className="flex items-center justify-between">
                  <Label>Lien généré</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copier
                  </Button>
                </div>
                <div className="mt-2 p-2 bg-background rounded border break-all text-xs">
                  {generatedLink}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleGenerateLink}>
              <Link className="h-4 w-4 mr-2" />
              Générer le lien
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
