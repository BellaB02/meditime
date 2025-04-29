
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LayoutGrid, 
  Route, 
  BarChart4,
  FileCheck,
  MessageSquare,
  Pill,
  DollarSign,
  Package,
  User
} from "lucide-react";

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: JSX.Element;
  isActive?: boolean;
  onClick?: () => void;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  to, 
  label, 
  icon, 
  isActive, 
  onClick 
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export function SidebarLinks({ onSelect }: { onSelect?: () => void }) {
  const location = useLocation();
  const pathname = location.pathname;
  
  const isPathActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };
  
  const links = [
    { to: "/", label: "Tableau de bord", icon: <Home size={20} /> },
    { to: "/patients", label: "Patients", icon: <Users size={20} /> },
    { to: "/calendar", label: "Agenda", icon: <Calendar size={20} /> },
    { to: "/rounds", label: "Tournées", icon: <Route size={20} /> },
    { to: "/caresheets", label: "Feuilles de soins", icon: <FileText size={20} /> },
    { to: "/care-protocols", label: "Protocoles", icon: <FileCheck size={20} /> },
    { to: "/patient-messages", label: "Messages", icon: <MessageSquare size={20} /> },
    { to: "/inventory", label: "Inventaire", icon: <Package size={20} /> },
    { to: "/admin/billing", label: "Facturation", icon: <DollarSign size={20} /> },
    { to: "/practice", label: "Cabinet", icon: <LayoutGrid size={20} /> },
    { to: "/patient-portal", label: "Portail Patient", icon: <User size={20} /> },
    { to: "/settings", label: "Paramètres", icon: <Settings size={20} /> },
  ];
  
  return (
    <nav className="space-y-1 px-2">
      {links.map((link) => (
        <SidebarLink
          key={link.to}
          to={link.to}
          label={link.label}
          icon={link.icon}
          isActive={isPathActive(link.to)}
          onClick={onSelect}
        />
      ))}
    </nav>
  );
}
