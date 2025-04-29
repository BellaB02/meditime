
import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Check, 
  Clock,
  Calendar,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationService } from '@/services/NotificationService';
import { useProfile } from '@/hooks/useProfile';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  type?: string | null;
  created_at?: string | null;
}

const NotificationIcon = ({ type }: { type?: string | null }) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case 'message':
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case 'system':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

const NotificationCenter = () => {
  const { profile } = useProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const fetchNotifications = async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const data = await NotificationService.getUserNotifications(profile.id);
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (profile?.id) {
      fetchNotifications();
    }
  }, [profile?.id]);
  
  const handleMarkAsRead = async (notificationId: string) => {
    const success = await NotificationService.markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };
  
  const formatNotificationDate = (dateString?: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true, locale: fr });
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-medium text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" onClick={() => setIsOpen(false)}>
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Clock className="h-5 w-5 mx-auto mb-2 animate-spin" />
              Chargement des notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification.id} className={`p-4 relative ${!notification.is_read ? 'bg-muted/30' : ''}`}>
                <div className="flex gap-3">
                  <div className="mt-1">
                    <NotificationIcon type={notification.type} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{notification.title}</h5>
                      <span className="text-[11px] text-muted-foreground">
                        {formatNotificationDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.content}</p>
                  </div>
                </div>
                {!notification.is_read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 absolute top-2 right-2 opacity-50 hover:opacity-100"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">Marquer comme lu</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
