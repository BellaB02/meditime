
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, Users, Calendar, MapPin, FileText, 
  Receipt, FileCheck, Building, Settings, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useSidebar } from './SidebarProvider';
import { supabase } from "@/integrations/supabase/client";

export function MobileNav() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();
  
  const routes = [
    { 
      name: 'Accueil', 
      path: '/', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Patients', 
      path: '/patients', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Planning', 
      path: '/calendar', 
      icon: <Calendar className="h-5 w-5" /> 
    },
    { 
      name: 'Tournées', 
      path: '/rounds', 
      icon: <MapPin className="h-5 w-5" /> 
    },
    { 
      name: 'Admin', 
      path: '/admin', 
      icon: <FileText className="h-5 w-5" /> 
    }
  ];
  
  const additionalRoutes = [
    { 
      name: 'Facturation', 
      path: '/admin/billing', 
      icon: <Receipt className="h-5 w-5" /> 
    },
    { 
      name: 'Feuilles', 
      path: '/caresheets', 
      icon: <FileCheck className="h-5 w-5" /> 
    },
    { 
      name: 'Cabinet', 
      path: '/practice', 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      name: 'Paramètres', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];
  
  // Detect if we're on iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  
  // On iOS, use Sheet (side panel). On other platforms, decide based on screen width
  const useSheet = isIOS || window.innerWidth <= 640;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const NavLink = ({ route }: { route: { name: string, path: string, icon: JSX.Element } }) => (
    <Link
      to={route.path}
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-md transition-colors",
        isActive(route.path) 
          ? "text-primary font-medium" 
          : "text-muted-foreground hover:text-primary"
      )}
    >
      {route.icon}
      <span className="text-xs mt-1">{route.name}</span>
    </Link>
  );
  
  // Liste complète pour le menu déroulant
  const AllRoutes = () => (
    <div className="grid grid-cols-4 gap-4 p-4">
      {[...routes, ...additionalRoutes].map((route) => (
        <NavLink key={route.path} route={route} />
      ))}
    </div>
  );
  
  // Barre de navigation fixe en bas pour mobile
  return (
    <>
      {/* Navigation fixe pour les 5 routes principales */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex justify-between items-center px-1 md:hidden z-50",
        isIOS && "pb-6" // Add extra padding at the bottom for iOS safe area
      )}>
        {routes.map((route) => (
          <NavLink key={route.path} route={route} />
        ))}
        
        {useSheet ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center justify-center h-full p-2">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Plus</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <h3 className="text-lg font-medium mb-4 text-center">
                Menu Meditime Pro
              </h3>
              <AllRoutes />
            </SheetContent>
          </Sheet>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="flex flex-col items-center justify-center h-full p-2">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Plus</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <h3 className="text-lg font-medium p-4 text-center border-b">
                  Menu Meditime Pro
                </h3>
                <AllRoutes />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      
      {/* Espace réservé pour éviter que le contenu ne soit caché derrière la navigation */}
      <div className={cn("h-16 md:hidden", isIOS && "h-24")} />
    </>
  );
}
