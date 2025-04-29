
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { EmailService } from "./EmailService";

interface Notification {
  id: string;
  user_id?: string | null;
  title: string;
  content: string;
  is_read: boolean;
  type?: string | null; // 'appointment', 'message', 'system', etc.
  related_id?: string | null; // ID of related item (appointment, message, etc.)
  created_at?: string | null;
}

export const NotificationService = {
  /**
   * Récupère les notifications pour un utilisateur spécifique
   */
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      // Simule une requête à une table de notifications qui n'existe pas encore
      // Dans une application réelle, cela appellerait Supabase
      console.log(`Récupération des notifications pour l'utilisateur ${userId}`);
      
      // Générer quelques notifications fictives pour la démonstration
      const notifications = [
        {
          id: "1",
          user_id: userId,
          title: "Nouveau message",
          content: "Vous avez reçu un nouveau message d'un patient",
          is_read: false,
          type: "message",
          related_id: "msg1",
          created_at: new Date().toISOString()
        },
        {
          id: "2",
          user_id: userId,
          title: "Rendez-vous à venir",
          content: "Vous avez un rendez-vous demain à 14h00",
          is_read: true,
          type: "appointment",
          related_id: "apt1",
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "3",
          user_id: userId,
          title: "Fiche patient mise à jour",
          content: "Les informations du patient ont été mises à jour",
          is_read: false,
          type: "system",
          related_id: null,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      
      return notifications;
    } catch (err) {
      console.error('Erreur lors de la récupération des notifications:', err);
      return [];
    }
  },
  
  /**
   * Marque une notification comme lue
   */
  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      // Simule une mise à jour dans Supabase
      console.log(`Marquer la notification ${notificationId} comme lue`);
      return true;
    } catch (err) {
      console.error('Erreur lors du marquage de la notification comme lue:', err);
      return false;
    }
  },
  
  /**
   * Crée une nouvelle notification
   */
  createNotification: async (notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>): Promise<Notification | null> => {
    try {
      // Simule la création d'une notification dans Supabase
      console.log(`Création d'une notification: ${notification.title}`);
      
      const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        ...notification,
        is_read: false,
        created_at: new Date().toISOString()
      };
      
      return newNotification;
    } catch (err) {
      console.error('Erreur lors de la création de la notification:', err);
      return null;
    }
  },
  
  /**
   * Envoie une notification par email
   */
  sendEmailNotification: async (email: string, subject: string, message: string): Promise<boolean> => {
    try {
      await EmailService.sendNotificationEmail(email, subject, message);
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'envoi de l\'email de notification:', err);
      return false;
    }
  },
  
  /**
   * Envoie une notification toast
   */
  showToastNotification: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void => {
    switch (type) {
      case 'success':
        toast.success(title, {
          description: message
        });
        break;
      case 'error':
        toast.error(title, {
          description: message
        });
        break;
      case 'warning':
        toast.warning(title, {
          description: message
        });
        break;
      default:
        toast(title, {
          description: message
        });
        break;
    }
  }
};
