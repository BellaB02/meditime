
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import Sidebar from './Sidebar';
import Header from './Header';
import { useSidebar } from './SidebarProvider';

const getTitleFromPath = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Tableau de bord';
    case '/patients':
      return 'Patients';
    case '/calendar':
      return 'Planning';
    case '/admin':
      return 'Administratif';
    default:
      if (pathname.startsWith('/patients/')) {
        return 'Fiche Patient';
      }
      return 'Page non trouvée';
  }
};

const Layout = () => {
  const { isOpen } = useSidebar();
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar />
      <main className={cn(
        'flex-1 transition-all duration-300',
        isOpen ? 'ml-64' : 'ml-[70px]'
      )}>
        <Header title={title} />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
