
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TemporaryAccessService } from "@/services/TemporaryAccessService";
import { RefreshCw, Send, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const TemporaryAccessLinks = () => {
  const [links, setLinks] = useState(() => TemporaryAccessService.getActiveAccessLinks());
  const isMobile = useIsMobile();
  
  const handleRefresh = () => {
    setLinks(TemporaryAccessService.getActiveAccessLinks());
  };
  
  const getRemainingTime = (expiryDate: Date): string => {
    const now = new Date();
    const diffMs = expiryDate.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    }
    
    return `${diffHrs} heure${diffHrs > 1 ? 's' : ''}`;
  };
  
  const handleRevoke = (id: string) => {
    if (TemporaryAccessService.revokeAccess(id)) {
      setLinks(links.filter(link => link.id !== id));
      toast.success("Invitation révoquée");
    }
  };
  
  const handleResend = (id: string) => {
    if (TemporaryAccessService.resendInvitation(id)) {
      toast.success("Invitation renvoyée");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Liens d'accès temporaires</CardTitle>
          <CardDescription>Gérez les invitations en attente</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucune invitation en attente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {links.map(link => (
              <div 
                key={link.id} 
                className="border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{link.name}</span>
                    <Badge variant="outline">{link.role === 'admin' ? 'Administrateur' : link.role === 'nurse' ? 'Infirmier' : 'Secrétaire'}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{link.email}</p>
                  <p className="text-xs">
                    Expire dans <span className="font-medium">{getRemainingTime(link.expires)}</span>
                  </p>
                </div>
                <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={isMobile ? "flex-1" : ""} 
                    onClick={() => handleResend(link.id)}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    {isMobile ? "" : "Renvoyer"}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className={isMobile ? "flex-1" : ""} 
                    onClick={() => handleRevoke(link.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    {isMobile ? "" : "Révoquer"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
