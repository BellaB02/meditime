
import { toast } from "sonner";
import { EmailService } from "./EmailService";

interface TemporaryAccess {
  id: string;
  token: string;
  email: string;
  expires: Date;
  role: string;
  name: string;
  used: boolean;
}

const temporaryAccessLinks: TemporaryAccess[] = [];

export const TemporaryAccessService = {
  /**
   * Génère un lien d'accès temporaire
   */
  generateTemporaryAccess: (email: string, role: string, name: string, durationInHours: number = 24): { id: string, token: string, link: string } => {
    // Générer un token unique
    const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    
    // Calculer la date d'expiration
    const expires = new Date();
    expires.setHours(expires.getHours() + durationInHours);
    
    // Créer l'accès temporaire
    const id = `access-${Date.now()}`;
    const access: TemporaryAccess = {
      id,
      token,
      email,
      expires,
      role,
      name,
      used: false
    };
    
    // Ajouter à la liste des accès
    temporaryAccessLinks.push(access);
    
    // Créer le lien complet (dans une vraie application, ce serait l'URL du site)
    const link = `${window.location.origin}/auth?token=${token}`;
    
    // Envoyer un email d'invitation (dans une vraie application)
    EmailService.sendInvitationEmail(email, name, link)
      .then(success => {
        if (success) {
          console.log(`Email d'invitation envoyé à ${email}`);
        }
      });
    
    return { id, token, link };
  },
  
  /**
   * Vérifie si un token est valide
   */
  validateToken: (token: string): TemporaryAccess | null => {
    const access = temporaryAccessLinks.find(a => a.token === token && !a.used);
    
    if (!access) {
      return null;
    }
    
    // Vérifier si le token n'est pas expiré
    if (new Date() > access.expires) {
      return null;
    }
    
    // Marquer le token comme utilisé
    access.used = true;
    
    return access;
  },
  
  /**
   * Récupère tous les accès temporaires actifs
   */
  getActiveAccessLinks: (): TemporaryAccess[] => {
    const now = new Date();
    return temporaryAccessLinks
      .filter(access => !access.used && access.expires > now)
      .sort((a, b) => a.expires.getTime() - b.expires.getTime());
  },
  
  /**
   * Révoque un accès temporaire
   */
  revokeAccess: (id: string): boolean => {
    const index = temporaryAccessLinks.findIndex(access => access.id === id);
    
    if (index === -1) {
      return false;
    }
    
    // Marquer comme utilisé (révoqué)
    temporaryAccessLinks[index].used = true;
    return true;
  },
  
  /**
   * Renvoie une invitation par email
   */
  resendInvitation: (id: string): boolean => {
    const access = temporaryAccessLinks.find(a => a.id === id && !a.used);
    
    if (!access) {
      return false;
    }
    
    // Vérifier si le token n'est pas expiré
    if (new Date() > access.expires) {
      return false;
    }
    
    // Créer le lien complet
    const link = `${window.location.origin}/auth?token=${access.token}`;
    
    // Envoyer un nouvel email d'invitation
    EmailService.sendInvitationEmail(access.email, access.name, link)
      .then(success => {
        if (success) {
          console.log(`Email d'invitation renvoyé à ${access.email}`);
          toast.success(`Email renvoyé à ${access.email}`);
        }
      });
    
    return true;
  }
};
