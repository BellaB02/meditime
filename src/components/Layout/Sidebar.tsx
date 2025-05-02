
import { NavLink } from 'react-router-dom';
import {
  Calendar, FileText, Users, Home, Clock, Stethoscope, Receipt, Settings,
  FileCheck, MapPin, User, Building
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './SidebarProvider';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar = () => {
  const { isOpen } = useSidebar();
  const isMobile = useIsMobile();
  
  // Ne pas rendre le sidebar sur mobile
  if (isMobile) {
    return null;
  }
  
  return (
    <aside 
      className={cn(
        'fixed left-0 top-0 z-20 h-full bg-sidebar transition-all duration-300 border-r border-sidebar-border',
        isOpen ? 'w-64' : 'w-[70px]'
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className={cn('flex items-center overflow-hidden', isOpen ? 'justify-start' : 'justify-center')}>
          <img src="/lovable-uploads/f32c5bf3-0b98-449e-8874-7a5665e67228.png" alt="Meditime Logo" className="h-8 w-8" />
          {isOpen && (
            <h1 className="ml-2 text-lg font-semibold text-primary">Meditime Pro</h1>
          )}
        </div>
      </div>
      
      <nav className="px-2 pt-4">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
              end
            >
              <Home size={20} />
              {isOpen && <span>Tableau de bord</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/patients" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <Users size={20} />
              {isOpen && <span>Patients</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/calendar" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <Calendar size={20} />
              {isOpen && <span>Planning</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/rounds" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <MapPin size={20} />
              {isOpen && <span>Tournées</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <FileText size={20} />
              {isOpen && <span>Administratif</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/billing" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
              end
            >
              <Receipt size={20} />
              {isOpen && <span>Facturation</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/caresheets" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <FileCheck size={20} />
              {isOpen && <span>Feuilles de soins</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/practice" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <Building size={20} />
              {isOpen && <span>Cabinet</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({isActive}) => cn('nav-link', isActive && 'active')}
            >
              <Settings size={20} />
              {isOpen && <span>Paramètres</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
