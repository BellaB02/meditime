
import { Outlet, useLocation, Link } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Sidebar from './Sidebar';
import { Header } from './Header';
import { useSidebar } from './SidebarProvider';
import { MobileNav } from './MobileNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import OfflineIndicator from './OfflineIndicator';

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
    case '/contact':
      return 'Contact';
    case '/mentions-legales':
      return 'Informations légales';
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

const Layout = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);
  const isMobile = useIsMobile();
  const [isIOS, setIsIOS] = useState(false);
  
  useEffect(() => {
    // Detect iOS devices
    const checkIOS = () => {
      const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isAppleDevice);
    };
    
    checkIOS();
  }, []);

  return (
    <div className={cn(
      "min-h-screen flex w-full flex-col",
      isIOS && "pb-safe"
    )}>
      {/* Sidebar pour desktop */}
      <Sidebar />
      
      <main className={cn(
        'flex-1 transition-all duration-300 flex flex-col',
        isOpen ? 'ml-64' : 'ml-[70px]',
        isMobile && 'ml-0'
      )}>
        <Header />
        <div className={cn(
          "p-4 sm:p-6 pb-20 md:pb-6 flex-grow",
          isIOS && "pb-24 md:pb-6" // Add extra padding at the bottom for iOS
        )}>
          <Outlet />
        </div>
        
        {/* Footer avec liens légaux */}
        <footer className="bg-muted mt-auto py-4 border-t">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">
                  &copy; 2025 Meditime Pro. Tous droits réservés.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/mentions-legales" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Mentions légales
                </Link>
                <Link to="/mentions-legales?tab=confidentialite" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
                <Link to="/mentions-legales?tab=cgu" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  CGU
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Navigation mobile */}
        <MobileNav />
        
        {/* Offline mode indicator */}
        <OfflineIndicator />
      </main>
    </div>
  );
};

export default Layout;
