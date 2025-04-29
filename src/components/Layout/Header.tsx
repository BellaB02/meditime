
import { Menu, Bell, User } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { toggle } = useSidebar();

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
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
