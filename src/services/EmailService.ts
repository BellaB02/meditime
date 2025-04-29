
import { toast } from "sonner";

export const EmailService = {
  /**
   * Envoie un email d'invitation à rejoindre le cabinet
   * Dans une application réelle, ce service appellerait une API pour envoyer l'email
   */
  sendInvitationEmail: (email: string, name: string, invitationLink: string): Promise<boolean> => {
    // Simuler l'envoi d'un email
    console.log(`Envoi d'un email à ${email} pour ${name} avec le lien ${invitationLink}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Email envoyé à ${email}`);
        resolve(true);
      }, 1500);
    });
  },
  
  /**
   * Envoie une notification par email
   */
  sendNotificationEmail: (email: string, subject: string, message: string): Promise<boolean> => {
    // Simuler l'envoi d'un email
    console.log(`Envoi d'une notification à ${email}: ${subject} - ${message}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Notification envoyée à ${email}`);
        resolve(true);
      }, 1000);
    });
  }
};
