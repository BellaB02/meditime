
import { Menu, Bell, User } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationsPanel } from './NotificationsPanel';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { toggle } = useSidebar();
  const { unreadCount, toggleNotificationsPanel, isPanelOpen } = useNotifications();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 sticky top-0 z-10 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggle}
          className="mr-4"
        >
          <Menu size={20} />
        </Button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleNotificationsPanel}
            className={isPanelOpen ? 'bg-accent' : ''}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
          <NotificationsPanel />
        </div>
        <Link to="/settings/profile">
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
