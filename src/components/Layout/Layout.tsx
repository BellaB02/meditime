
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Sidebar from './Sidebar';
import { Header } from './Header';
import { useSidebar } from './SidebarProvider';
import { MobileNav } from './MobileNav';
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

const Layout = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex w-full">
      {/* Sidebar pour desktop */}
      <Sidebar />
      
      <main className={cn(
        'flex-1 transition-all duration-300',
        isOpen ? 'ml-64' : 'ml-[70px]',
        isMobile && 'ml-0'
      )}>
        <Header />
        <div className="p-4 sm:p-6 pb-20 md:pb-6">
          <Outlet />
        </div>
        
        {/* Navigation mobile */}
        <MobileNav />
      </main>
    </div>
  );
};

export default Layout;
