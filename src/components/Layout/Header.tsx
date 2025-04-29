import React from 'react';
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from './SidebarProvider';
import { UserButton } from './UserButton';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile';

const getTitleFromPath = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Tableau de bord';
    case '/patients':
      return 'Patients';
    case '/calendar':
      return 'Planning';
    case '/rounds':
      return 'Tournées';
    case '/admin':
      return 'Administratif';
    case '/admin/billing':
      return 'Facturation';
    case '/caresheets':
      return 'Feuilles de soins';
    case '/practice':
      return 'Cabinet';
    case '/settings':
      return 'Paramètres';
    default:
      if (pathname.startsWith('/patients/')) {
        return 'Fiche Patient';
      }
      if (pathname.startsWith('/settings/')) {
        return 'Paramètres';
      }
      return 'Page non trouvée';
  }
};

import NotificationCenter from './NotificationCenter';

export function Header() {
  const { isOpen, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <header 
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b bg-background px-4 md:px-6",
        isMobile && "justify-end"
      )}
    >
      {!isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-4"
          onClick={() => toggleSidebar()}
        >
          {isOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}
      
      <div className="flex-1">
        {!isMobile && (
          <h1 className="text-lg font-semibold">
            {getTitleFromPath(location.pathname)}
          </h1>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <NotificationCenter />
        <UserButton />
      </div>
    </header>
  );
}
