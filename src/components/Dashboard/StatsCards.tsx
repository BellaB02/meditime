
import { Card } from "@/components/ui/card";
import { Clock, Calendar, Users, FileText } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatCard = ({ title, value, icon, description }: StatCardProps) => {
  return (
    <Card className="stats-card flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="bg-primary/10 text-primary p-2 rounded-full">
          {icon}
        </div>
      </div>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </Card>
  );
};

export const StatsCards = ({ className }: { className?: string }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className || ''}`}>
      <StatCard 
        title="RDV aujourd'hui" 
        value={8} 
        icon={<Clock size={24} />} 
        description="3 rendez-vous à venir"
      />
      <StatCard 
        title="Total patients" 
        value={52} 
        icon={<Users size={24} />}
      />
      <StatCard 
        title="Prochains jours" 
        value={24} 
        icon={<Calendar size={24} />}
        description="Dans les 7 prochains jours"
      />
      <StatCard 
        title="Facturation en attente" 
        value={12} 
        icon={<FileText size={24} />}
        description="3 factures urgentes"
      />
    </div>
  );
};

export default StatsCards;
