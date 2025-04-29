
import { X, Check, Bell } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const NotificationsPanel = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    isPanelOpen,
    toggleNotificationsPanel
  } = useNotifications();
  
  const navigate = useNavigate();
  
  if (!isPanelOpen) return null;
  
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
      toggleNotificationsPanel();
    }
  };
  
  return (
    <div className="fixed right-4 top-16 z-50 w-80 bg-background border rounded-lg shadow-lg animate-in slide-in-from-top-5">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium flex items-center gap-2">
          <Bell size={16} />
          Notifications
        </h3>
        <Button variant="ghost" size="sm" onClick={toggleNotificationsPanel}>
          <X size={16} />
        </Button>
      </div>
      
      {notifications.length > 0 ? (
        <>
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-3 border-b hover:bg-accent/50 cursor-pointer",
                  !notification.read && "bg-accent/20"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {format(notification.date, "HH:mm", { locale: fr })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
              </div>
            ))}
          </div>
          <div className="p-2 flex justify-between">
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check size={14} className="mr-1" />
              Tout marquer comme lu
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
              Effacer tout
            </Button>
          </div>
        </>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          Aucune notification
        </div>
      )}
    </div>
  );
};
