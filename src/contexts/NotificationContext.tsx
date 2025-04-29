
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  date: Date;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "read" | "date">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  toggleNotificationsPanel: () => void;
  isPanelOpen: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Ajouter une nouvelle notification
  const addNotification = (notification: Omit<Notification, "id" | "read" | "date">) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      date: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Afficher un toast pour les nouvelles notifications
    toast[notification.type || "info"](`${notification.title}: ${notification.message}`);
    
    // Si le navigateur supporte les notifications web et que l'utilisateur a donné son accord
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(notification.title, { body: notification.message });
      } catch (error) {
        console.error("Erreur lors de l'envoi de la notification", error);
      }
    }
  };
  
  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  // Effacer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Basculer le panneau des notifications
  const toggleNotificationsPanel = () => {
    setIsPanelOpen(prev => !prev);
  };
  
  // Demander l'autorisation pour les notifications du navigateur au chargement
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    
    // Ajouter quelques notifications de test
    addNotification({
      title: "Bienvenue",
      message: "Bienvenue sur Infirmier Facile",
      type: "info",
    });
    
    addNotification({
      title: "Soins aujourd'hui",
      message: "Vous avez 5 soins planifiés aujourd'hui",
      type: "info",
      link: "/calendar"
    });
  }, []);
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        toggleNotificationsPanel,
        isPanelOpen
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
